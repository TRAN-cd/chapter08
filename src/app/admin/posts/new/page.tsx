'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/_type/Category";

export default function CreateNewPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    categories:[] as { id: number }[]
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/categories/");
        const data: { categories: Category[] } = await response.json();

        setAllCategories(data.categories);

        setLoading(false);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      };
    }

    fetchCategories();
  }, [])

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId) // すでにあれば外す
        : [...prev, categoryId]                  // なければ追加する
    )
  }

  const handleCreate = async () => {
    const dataToSubmit = {
      ...form,
      categories: selectedCategoryIds.map(id => ({ id })) // IDの配列をオブジェクト配列に変換
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ここでCreatePostRequestBody型のデータを送信
        body: JSON.stringify(dataToSubmit),
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])

  return (
    <>
      <div className="flex h-screen">
        <nav className="w-[20%] h-full bg-gray-100">
          <ul className="font-bold">
            <li className="p-4 bg-blue-200">
              <Link href="/admin/posts">記事一覧</Link>
              </li>
            <li className="p-4">
              <Link href="/admin/categories">カテゴリー一覧</Link>
            </li>
          </ul>
        </nav>
        <div className="p-2.5 w-[80%]">
          <h1 className="text-xl font-extrabold tracking-wide pb-2">記事作成</h1>
          <form className="p-2.5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="title">タイトル</label>
              <input id="title" name="title" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.title} disabled={isSubmitting}/>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content">内容</label>
              <input id="content" name="content" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.content} disabled={isSubmitting}/>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="thumbnailUrl">サムネイルURL</label>
              <input id="thumbnailUrl" name="thumbnailUrl" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.thumbnailUrl} disabled={isSubmitting}/>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="categories">カテゴリー</label>
              {isMounted && allCategories.map((category) => (
                <div key={category.id}>
                  <input
                    type="checkbox"
                    id={`cat-${category.id}`}
                    name={category.name}
                    value={category.name}
                    className="mr-2"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => handleToggleCategory(category.id)} 
                    disabled={isSubmitting}/>
                  <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer" onClick={handleCreate} disabled={isSubmitting}>作成</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}