'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CategoriesIndexResponse } from "@/app/_type/CategoriesIndexResponse";

export default function AdminCategoriesComponent() {
  const [categories, setCategories] = useState<CategoriesIndexResponse['categories']>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async() => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/categories/');
        const { categories } = await response.json();
        setCategories(categories);
        setLoading(false)
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      }
    }

    fetcher()
  }, []);

  if (loading) return <p>カテゴリーを読み込み中です...</p>
  if (categories.length === 0) return <p>データがありません。</p>

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-2">
          <h1 className="text-xl font-extrabold tracking-wide">カテゴリー一覧</h1>
          <Link href="/admin/categories/new">
            <button className="text-white font-bold bg-blue-400 pt-2 pb-2 pl-4 pr-4 rounded-sm">新規作成</button>
          </Link>
        </div>
        {categories.map((elem) => (
          <Link href={`/admin/categories/${elem.id}`} key={elem.id} className="block border-b border-[#9e9e9e]">
            <p className="pt-4 pb-4 pl-2 pr-2 font-bold">{elem.name}</p>
          </Link>
        ))
        }
      </div>
    </>
  )
}