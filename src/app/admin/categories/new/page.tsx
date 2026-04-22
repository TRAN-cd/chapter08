'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewCategory(){
  const router = useRouter();
  const [form, setForm] = useState({
    name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
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
      <div className="flex h-screen">
        <nav className="w-[20%] h-full bg-gray-100">
          <ul className="font-bold">
            <li className="p-4">
              <Link href="/admin/posts">記事一覧</Link>
              </li>
            <li className="p-4 bg-blue-200">
              <Link href="/admin/categories">カテゴリー一覧</Link>
            </li>
          </ul>
        </nav>
        <div className="p-2.5 w-[80%]">
          <h1 className="text-xl font-extrabold tracking-wide pb-2">カテゴリー作成</h1>
          <form className="p-2.5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="category">カテゴリー</label>
              <input id="name" name="name" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.name} disabled={isSubmitting}/>
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