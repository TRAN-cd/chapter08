import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { PostsIndexResponse } from "@/app/_type/PostsIndexResponse"
import { supabase } from "@/app/_libs/supabase";

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // tokenが正しい場合、以降が実行される
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: { id: true, name: true }
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // レスポンスボディ
    return NextResponse.json<PostsIndexResponse>({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 }) 
  }
}


//// 記事新規作成
// 記事作成時に送られてくるリクエストのbodyの型
export type CreatePostRequestBody = {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

// 記事作成APIのレスポンスの型
export type CreatePostResponse = {
  id: number
}

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json()

    // bodyの中からtitle, content, categories, thumbnailImageKeyを取り出す
    const { title, content, categories, thumbnailImageKey } = body

    // 記事をDBに生成
    // prisma.post.createはSQLの INSERT INTOに相当する
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }


    return NextResponse.json<CreatePostResponse>({ id: data.id })
  } catch (error) {
    console.error("【APIエラー】:", error);
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}