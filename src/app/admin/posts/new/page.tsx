'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/_type/Category";
import { PostForm } from "../_components/PostForm";


export default function CreateNewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ここでCreatePostRequestBody型のデータを送信
        body: JSON.stringify({ 
          title,
          content,
          thumbnailUrl,
          categories: categories.map(c => ({ id: c.id })) 
        }),
      });

      if (response.ok) {
        alert("記事が作成されました。")
        router.push('/admin/posts')
      } else {
        alert("記事の作成に失敗しました。")
      }
    } catch (error) {
      console.log('新規作成エラー', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-extrabold tracking-wide pb-2">記事作成</h1>

        <PostForm
          mode="new"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleCreate}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}