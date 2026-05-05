'use client';

import { useRouter, useParams } from "next/navigation";
import type { PostShowResponse } from "@/app/_type/PostShowResponse";
import { PostForm, PostFormInputs } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from 'swr';

// 1. fetcherをasync-awaitで定義
const fetcher = async ([url, token]: [string, string]): Promise<PostFormInputs> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error('データ取得に失敗しました');
  }

  const data: PostShowResponse = await response.json();
  const { post } = data;
  return {
    title: post.title,
    content: post.content,
    thumbnailImageKey: post.thumbnailImageKey,
    categories: post.postCategories.map((pc) => pc.category),
  };
};


export default function PostEdit() {
  const router = useRouter();
  const { id } = useParams<{ id: string}>();
  const { token } = useSupabaseSession();

  const { data: initialData, error, isLoading } = useSWR(
    token && id ? [`/api/admin/posts/${id}`, token] : null,
    fetcher
  );

  // 更新処理関数
  const handleUpdate = async (data: PostFormInputs) => {
    if (!token) return
    
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ 
          title: data.title,
          content: data.content,
          thumbnailImageKey: data.thumbnailImageKey,
          categories: data.categories.map((c) => ({ id: c.id })),
        }),
      });

      if (response.ok) {
        alert('記事を更新しました。')
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
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        alert('削除しました。');
        router.push('/admin/posts');
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

  // データが取得できなかった場合のガード
  if (error) {
    return <div className="container mx-auto px-4 py-10">記事が見つかりませんでした。</div>
  }

  if (!initialData) {
    return null
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-extrabold tracking-wide pb-2">記事編集</h1>

        <PostForm 
          mode="edit"
          defaultValues={initialData}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          disabled={false}
        />
      </div>
    </>
  )
}