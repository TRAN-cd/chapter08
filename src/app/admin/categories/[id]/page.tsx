'use client';

// import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { CategoryShowResponse } from "@/app/_type/CategoryShowResponse";
import { CategoryForm, CategoryFormInputs } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from 'swr';

// 1. fetcherをasync-awaitで定義
const fetcher = async ([url, token]: [string, string]): Promise<CategoryFormInputs> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error('データ取得に失敗しました');
  }

  const data: CategoryShowResponse = await response.json();
  return { name: data.category.name };
};


export default function CategoryEdit() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token } = useSupabaseSession();

  // 2. useSWRの呼び出し
  const { data: initialData, error, isLoading } = useSWR(
    token && id ? [`/api/admin/categories/${id}`, token] : null,
    fetcher
  );


  // swrとの比較のため、以下コメントアウト残してます。
  //// ここからswrで書き換える

  // フォームに渡すための初期データを管理するState
  // const [initialData, setInitialData] = useState<CategoryFormInputs | null>(null);
  // const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   if (!token || !id) return

  //   const fetchCategory = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`/api/admin/categories/${id}`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       });
  //       const data: CategoryShowResponse = await response.json();

  //       console.log("取得したデータ:", data)

  //       setInitialData({ name: data.category.name });
  //     } catch (error) {
  //       console.error("データ取得に失敗しました", error);
  //     } finally {
  //       setLoading(false);
  //     };
  //   }

  //   fetchCategory();
  // }, [id, token])
  //// ここまでswrで書き換える

  // 更新処理関数
  const handleUpdate = async (data: CategoryFormInputs) => {
    if (!token) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (response.ok) {
        alert('カテゴリーを更新しました。')
        router.push('/admin/categories')
        router.refresh();
      } else {
        alert('更新に失敗しました。')
      }
    } catch (error) {
      console.log('更新エラー', error);
    }
  }

  // 削除処理関数
  const handleDelete = async () => {
    if (!token) return
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        alert('削除しました。');
        router.push('/admin/categories');
        router.refresh();
      } else {
        alert('削除に失敗しました。')
      }

    } catch (error) {
      console.error('削除エラー:', error)
    }
  }

  // データ取得中はローディングを表示し、PostForm のマウントを遅らせる
  if (isLoading) {
    return <div className="container mx-auto px-4 py-10">読み込み中...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-10">カテゴリーが見つかりませんでした。</div>
  }

  // データが取得できなかった場合のガード
  if (!initialData) {
    return null
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-xl font-extrabold tracking-wide">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        defaultValues={initialData}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        disabled={false}
      />
    </div>
  )
}