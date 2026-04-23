'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { CategoryShowResponse } from "@/app/_type/CategoryShowResponse";
import { CategoryForm } from "../_components/CategoryForm";


export default function CategoryEdit() {
  const router = useRouter();
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/categories/${id}`);
        const data: CategoryShowResponse = await response.json();

        console.log("取得したデータ:", data)

        setName(data.category.name);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      } finally {
        setLoading(false);
      };
    }

    fetchCategory();
  }, [id])

  if (loading) return <p>読み込み中...</p>

  // 更新処理関数
  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
      });

      if (response.ok) {
        alert('記事を更新しました。')
      } else {
        alert('更新に失敗しました。')
      }
    } catch (error) {
      console.log('更新エラー', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 削除処理関数
  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('削除しました。');
        router.push('/admin/categories');
      } else {
        alert('削除に失敗しました。')
      }

    } catch (error) {
      console.error('削除エラー:', error)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-2">
          <h1 className="text-xl font-extrabold tracking-wide">カテゴリー一覧</h1>
        </div>

        <CategoryForm
          mode="edit"
          name={name}
          setName={setName}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}