'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";

export default function CreateNewCategory(){
  const router = useRouter();
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
      });

      if (response.ok) {
        alert("カテゴリーが作成されました。")
        router.push('/admin/categories')
      } else {
        alert("カテゴリーの作成に失敗しました。")
      }
    } catch (error) {
      console.log('新規作成エラー', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return(
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-extrabold tracking-wide pb-2">カテゴリー作成</h1>

        <CategoryForm
          mode="new"
          name={name}
          setName={setName}
          onSubmit={handleCreate}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}