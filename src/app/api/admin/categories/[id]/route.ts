import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

//// カテゴリー詳細取得
export type CategoryShowResponse = {
  category: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {
  const {id} = await params

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません。"}, { status: 404 })
    }

    return NextResponse.json<CategoryShowResponse>({ category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

//// カテゴリー更新
// カテゴリー更新時に送られてくるリクエストのbodyの型
export type UpdateCategoryRequestBody = {
  name: string
}

export const PUT = async(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {
  const { id } = await params

  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    await prisma.category.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
      },
    })

    return NextResponse.json({ message: 'OK'}, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

//// 記事削除
export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {
  const { id } = await params

  try {
    await prisma.category.delete({
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