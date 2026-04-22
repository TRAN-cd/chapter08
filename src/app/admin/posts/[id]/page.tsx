'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostShowResponse } from "@/app/_type/PostShowResponse";
import type { Category } from "@/app/_type/Category";

export default function PostEdit(
  { params }: { params: Promise<{ id: string }> }
) {
  // ① paramsからidを取得できるようにする
  const [id, setId] = useState<string>("");
  useEffect(() => {
    const getParams = async () => {
      const p = await params;
      setId(p.id);
    };

    getParams();
  }, [params]);

  // ② フォームの初期値を定義する
  const [form, setForm] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    categories: [] as { id: number }[]
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);


  // ③ データを読み込み中かどうかの判定
  const [loading, setLoading] = useState(true);

  // ④ データを取得する
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/posts/${id}`);
        const data: PostShowResponse = await response.json();

        // 取得したデータをformの状態に流し込む
        const { post } = data;
        setForm({
          title: post.title,
          content: post.content,
          thumbnailUrl: post.thumbnailUrl,
          categories: post.postCategories.map(({ category }) => ({ id: category.id }))
        });

        console.log(post);
        const currentIds = post.postCategories.map((pc) => pc.category.id);
        setSelectedCategoryIds(currentIds);

        setLoading(false);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      };
    }

    fetchData();
  }, [id]);

  // ⑤ 更新処理関数
  const handleUpdate = async () => {
    // チェックボックスの最新状態をformのcategoriesに反映する
    const updateForm = {
      ...form,
      categories: selectedCategoryIds.map(id => ({ id }))
    };

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
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
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
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
    }
  }

  // ⑦ 全カテゴリー情報を取得する
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/categories/");
        const data: { categories: Category[] } = await response.json();

        setAllCategories(data.categories);
        // console.log(data.categories);

        setLoading(false);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      };
    }

    fetchCategories();
  }, [])

  // ⑧ 選択中のカテゴリーを更新する関数
  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId) // すでにあれば外す
        : [...prev, categoryId]                  // なければ追加する
    )
  }

  // ⑨ ハイドレーション対策：選択中のカテゴリーが取得される前にHTMLが読み込まれるので、マウント完了まで待たせる
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])

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
            <li className="p-4 bg-blue-200">
              <Link href="/admin/posts">記事一覧</Link>
            </li>
            <li className="p-4">
              <Link href="/admin/categories">カテゴリー一覧</Link>
            </li>
          </ul>
        </nav>
        <div className="p-2.5 w-[80%]">
          <h1 className="text-xl font-extrabold tracking-wide pb-2">記事編集</h1>
          <form className="p-2.5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="title">タイトル</label>
              <input id="title" name="title" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.title} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content">内容</label>
              <input id="content" name="content" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.content} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="thumbnailUrl">サムネイルURL</label>
              <input id="thumbnailUrl" name="thumbnailUrl" type="text" className="border border-b-gray-600 rounded-sm p-2" onChange={handleForm} value={form.thumbnailUrl} />
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
                    onChange={() => handleToggleCategory(category.id)} />
                  <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </div>

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
          </form>
        </div>
      </div>
    </>
  )
}