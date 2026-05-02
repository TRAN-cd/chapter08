'use client';

import { useRouter } from "next/navigation";
import { PostForm, PostFormInputs } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export default function CreateNewPost() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  // PostForm 内の handleSubmit(onSubmit) から、バリデーション済みのデータが渡される
  const handleCreate = async (data: PostFormInputs) => {

    if (!token) {
      alert("認証セッションが見つかりません。")
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        // ここでCreatePostRequestBody型のデータを送信
        body: JSON.stringify({ 
          title: data.title,
          content: data.content,
          thumbnailImageKey: data.thumbnailImageKey,
          categories: data.categories.map(c => ({ id: c.id })) 
        }),
      });

      if (response.ok) {
        alert("記事が作成されました。")
        router.push('/admin/posts')
        router.refresh()
      } else {
        alert("記事の作成に失敗しました。")
      }
    } catch (error) {
      console.log('新規作成エラー', error);
    } 
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-extrabold tracking-wide pb-2">記事作成</h1>

        <PostForm
          mode="new"
          onSubmit={handleCreate}
          disabled={false}
        />
      </div>
    </>
  )
}