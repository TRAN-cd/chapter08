'use client';

import Link from "next/link";
import type { CategoriesIndexResponse } from "@/app/_type/CategoriesIndexResponse";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from 'swr';

// 1. fetcherをasync-awaitで定義
const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error('データ取得に失敗しました');
  }

  const data: CategoriesIndexResponse = await response.json();
  return data.categories;
};

export default function AdminCategoriesComponent() {
  const { token } = useSupabaseSession();

  // 2. useSWRの呼び出し
  const { data: categories, error, isLoading } = useSWR( // dataはcategoriesにリネームしている。
    token ? ['/api/admin/categories/', token] : null,
    fetcher
  );

  // 3. 状態に応じた表示
  if (isLoading) return <p>カテゴリーを読み込み中です...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-xl font-extrabold tracking-wide">カテゴリー一覧</h1>
        <Link href="/admin/categories/new">
          <button className="text-white font-bold bg-blue-400 pt-2 pb-2 pl-4 pr-4 rounded-sm">新規作成</button>
        </Link>
      </div>

      {!categories || categories.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        categories.map((elem) => (
          <Link href={`/admin/categories/${elem.id}`} key={elem.id} className="block border-b border-[#9e9e9e]">
            <p className="pt-4 pb-4 pl-2 pr-2 font-bold">{elem.name}</p>
          </Link>
        ))
      )}
    </div>
  )
}