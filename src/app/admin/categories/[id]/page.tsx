'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryResponse } from "@/app/_type/CategoryResponse";

export default function CategoryEdit(
  { params }: { params: Promise<{ id: string }> }
) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    const getParams = async () => {
      const p = await params;
      setId(p.id);
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/categories/${id}`);
        const data: CategoryResponse = await response.json();

        console.log("取得したデータ:", data)
        setForm({
          name: data.category.name
        })
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      };
    }

    fetchCategory();
  }, [id])

  if (loading) return <p>読み込み中...</p>

  // 更新処理関数
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: form.name }),
      });

      if (response.ok) {
        alert('記事を更新しました。')
      } else {
        alert('更新に失敗しました。')
      }
    } catch (error) {
      console.log('更新エラー', error);
    }
  }

  // ⑥ 削除処理関数
  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
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
    }
  }

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
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
          <div className="flex justify-between items-center pb-2">
            <h1 className="text-xl font-extrabold tracking-wide">カテゴリー一覧</h1>
          </div>
          <form className="mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">カテゴリー</label>
              <input id="name" name="name" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.name} />
            </div>
          </form>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer" >更新</button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-t-2 px-4 bg-red-700 text-white rounded-lg cursor-pointer">削除</button>
          </div>
        </div>
      </div>
    </>
  )
}