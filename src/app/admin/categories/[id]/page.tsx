'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { CategoryShowResponse } from "@/app/_type/CategoryShowResponse";
import { CategoryForm, CategoryFormInputs } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export default function CategoryEdit() {
  const router = useRouter();
  // const [name, setName] = useState('')
  // const [loading, setLoading] = useState(true);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { token } = useSupabaseSession();

  // フォームに渡すための初期データを管理するState
  const [initialData, setInitialData] = useState<CategoryFormInputs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const data: CategoryShowResponse = await response.json();

        console.log("取得したデータ:", data)

        setInitialData({ name: data.category.name });
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      } finally {
        setLoading(false);
      };
    }

    fetchCategory();
  }, [id, token])

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
  if (loading) {
    return <div className="container mx-auto px-4 py-10">読み込み中...</div>
  }

  // データが取得できなかった場合のガード
  if (!initialData) {
    return <div className="container mx-auto px-4 py-10">カテゴリーが見つかりませんでした。</div>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-xl font-extrabold tracking-wide">カテゴリー一覧</h1>
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