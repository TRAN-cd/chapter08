import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Category } from "@/app/_type/Category";
import type { PostShowResponse } from "@/app/_type/PostShowResponse"
import { supabase } from "@/app/_libs/supabase";

//// 記事詳細取得
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 })

  const { id } = await params

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: { id: true, name: true}
            },
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { message: '記事が見つかりません。' },
        { status: 404 }
      )
    }

    return NextResponse.json<PostShowResponse>({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 }) 
  }
}

//// 記事更新
// 記事更新時に送られてくるリクエストのbodyの型
export type UpdatePostRequestBody = {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 })

  // どの記事を更新するか 特定する必要があるため、paramsからidを取得
  const { id } = await params

  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody = await request.json()

  try {
    // idを指定して、Postを更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    return NextResponse.json({ message: 'OK'}, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

//// 記事削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 })

  const { id } = await params

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id)
      },
    })


    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}