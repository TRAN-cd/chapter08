import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { CategoryShowResponse } from "@/app/_type/CategoryShowResponse";
import { supabase } from "@/app/_libs/supabase";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

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

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
    
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) => {

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

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