import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// 記事詳細一覧APIのレスポンスの型
export type PostShowResponse = {
  post: {
    id: number
    title: string
    content: string
    thumbnailUrl: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }
}

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        // URLではstring型なので、数値型に変換
        id: parseInt(id),
      },

      // カテゴリーも含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if(!post) {
      return NextResponse.json(
        { message: '記事が見つかりません。'},
        { status: 404 },
      )
    }

    // レスポンスを返す
    return NextResponse.json<PostShowResponse>({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 })
  }
}