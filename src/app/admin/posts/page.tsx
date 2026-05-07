'use client';

import Link from "next/link";
import type { PostsIndexResponse } from "@/app/_type/PostsIndexResponse"
import { PostThumbnail } from "@/app/_components/PostThumbnail";
import { useFetch } from "@/app/_hooks/useFetch";

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function AdminPostComponent(){
  const { data, error, isLoading } = useFetch<PostsIndexResponse>('/api/admin/posts/');
  const posts = data?.posts
  // console.log(posts);

  if (isLoading) return <p>記事を読み込み中です...</p>
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-2">
          <h1 className="text-xl font-extrabold tracking-wide">記事一覧</h1>
          <Link href="/admin/posts/new">
            <button className="text-white font-bold bg-blue-400 pt-2 pb-2 pl-4 pr-4 rounded-sm">新規作成</button>
          </Link>
        </div>

        { !posts || posts.length === 0 ? (
          <p>データがありません。</p>
        ) : (
          posts.map((elem, index) => (
            <Link href={`/admin/posts/${elem.id}`} key={elem.id} className="block border-b border-[#9e9e9e]">
              <div className="flex flex-col gap-2.5 pt-2.5 pb-2.5 sm:flex-row">
                <div className="max-w-1/3">
                  <PostThumbnail imageKey={elem.thumbnailImageKey} alt={elem.title}/>
                </div>
                <div className="flex flex-col gap-2.5 w-full sm:w-[60%]">
                  <div className="flex items-center gap-2.5">
                    <p>{formatDate(elem.createdAt)}</p>
                    <ul className="flex gap-2.5">
                      {elem.postCategories.map((cat, i) => (
                        <li key={i} className="bg-gray-300 pt-1.25 pb-1.25 pr-2.5 pl-2.5 rounded-[50px]">{cat.category.name}</li>
                      ))}
                    </ul>
                  </div>
                  <h2 className="text-2xl font-bold">{elem.title}</h2>
                  <p className="text-base" dangerouslySetInnerHTML={{ __html: elem.content }} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}