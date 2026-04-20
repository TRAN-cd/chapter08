'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/app/_type/Category";

export default function AdminCategoriesComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async() => {
      setLoading(true)

      const response = await fetch('/api/admin/categories/');
      const { categories } = await response.json();
      setCategories(categories);
      console.log(categories);

      setLoading(false)
    }

    fetcher()
  }, []);

  if (loading) return <p>カテゴリーを読み込み中です...</p>
  if (categories.length === 0) return <p>データがありません。</p>

  return (
    <>
      <div className="flex h-screen">
        <nav className="w-[20%] h-full bg-gray-100">
          <ul className="font-bold">
            <li className="p-4">
              <Link href="/admin/posts">記事一覧</Link>
              </li>
            <li className="p-4 bg-blue-200">
              <Link href="/admin/categories">カテゴリー一覧</Link>
            </li>
          </ul>
        </nav>
        <div className="p-2.5 w-[80%]">
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
      </div>
    </>
  )
}