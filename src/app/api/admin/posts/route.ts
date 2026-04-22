import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import type { PostsIndexResponse } from "@/app/_type/PostsIndexResponse"

export const GET = async () => {
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
  thumbnailUrl: string
}

// 記事作成APIのレスポンスの型
export type CreatePostResponse = {
  id: number
}

export const POST = async (request: Request) => {
  try {
    // リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json()

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailUrl } = body

    // 記事をDBに生成
    // prisma.post.createはSQLの INSERT INTOに相当する
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
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
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}