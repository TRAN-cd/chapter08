'use client';

import { useRouter, useParams } from "next/navigation";
import type { CategoryShowResponse } from "@/app/_type/CategoryShowResponse";
import { CategoryForm, CategoryFormInputs } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";


export default function CategoryEdit() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useFetch<CategoryShowResponse>(`/api/admin/categories/${id}`);
  const initialData = data ? { name: data.category.name } : null;
  // console.log(data);

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