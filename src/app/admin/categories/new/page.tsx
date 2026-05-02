'use client';

import { useRouter } from "next/navigation";
import { CategoryForm, CategoryFormInputs } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CreateNewCategory() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleCreate = async (data: CategoryFormInputs) => {
    if (!token) {
      alert("認証セッションが見つかりません。")
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (response.ok) {
        alert("カテゴリーが作成されました。")
        router.push('/admin/categories')
        router.refresh()
      } else {
        alert("カテゴリーの作成に失敗しました。")
      }
    } catch (error) {
      console.log('新規作成エラー', error);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-extrabold tracking-wide pb-2">カテゴリー作成</h1>

      <CategoryForm
        mode="new"
        onSubmit={handleCreate}
        disabled={false}
      />
    </div>
  )
}