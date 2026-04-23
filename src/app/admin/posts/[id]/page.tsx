'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { PostShowResponse } from "@/app/_type/PostShowResponse";
import type { Category } from "@/app/_type/Category";
import { PostForm } from "../_components/PostForm";


export default function PostEdit() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams<{ id: string}>();
  const [loading, setLoading] = useState(true);

  // データを取得する
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/posts/${id}`);
        const data: PostShowResponse = await response.json();
        const { post } = data;

        setTitle(post.title)
        setContent(post.content)
        setThumbnailUrl(post.thumbnailUrl)
        setCategories(post.postCategories.map((pc) => pc.category))

        setLoading(false);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      };
    }

    fetchData();
  }, [id]);

  // 更新処理関数
  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title,
          content,
          thumbnailUrl,
          categories: categories.map(c => ({ id: c.id })) 
        }),
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
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('削除しました。');
        router.push('/admin/posts');
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
        <h1 className="text-xl font-extrabold tracking-wide pb-2">記事編集</h1>

        <PostForm 
          mode="edit"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          disabled={isSubmitting}
        />
      </div>
    </>
  )
}