import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import type { CategoriesIndexResponse } from "@/app/_type/CategoriesIndexResponse";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json<CategoriesIndexResponse>({categories}, {status: 200})
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({message: error.message}, {status: 400}) 
  }
}

//// カテゴリー新規作成
// カテゴリー作成時に送られてくるリクエストのbodyの型
export type CreateCategoryRequestBody = {
  name: string
}

// カテゴリー作成APIのレスポンスの型
export type CreateCategoryResponse = {
  id: number
}

export const POST = async (request: Request) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーwpDBに生成（追加）
    const data = await prisma.category.create({
      data: {
        name,
      },
    })


    return NextResponse.json<CreateCategoryResponse>({id: data.id })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}