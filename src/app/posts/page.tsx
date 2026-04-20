'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { PostsIndexResponse } from "@/app/_type/PostsIndexResponse";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};


export default function PostComponent(){
  const [posts, setPosts] = useState<PostsIndexResponse['posts']>([])  //
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts);
      setLoading(false)
    }
  
    fetcher();
  }, []);
  
  if (loading) return <p>記事を読み込み中です...</p>;
  if (posts.length === 0) return <p>データがありません。</p>;

  return (
    <>
      <div className="p-2.5">
        <h1 className="text-xl font-extrabold tracking-wide">記事一覧</h1>
        {posts.map((elem, index) => (
          <Link href={`/posts/${elem.id}`} className="flex flex-col gap-2.5 pb-2.5 sm:flex-row" key={index}>
            <div className="max-w-full w-full sm:max-w-[50%]">
              <Image src={elem.thumbnailUrl} alt="" width={800} height={400} className="w-full align-bottom"/>
            </div>
            <div className="flex flex-col gap-2.5 w-full sm:w-[50%]">
              <div className="flex items-center gap-2.5">
                <p>{formatDate(elem.createdAt)}</p>
                <ul className="flex  gap-2.5">
                  {elem.postCategories.map((cat, i) => (
                    <li key={i} className="bg-gray-300 pt-1.25 pb-1.25 pr-2.5 pl-2.5 rounded-[50px]">{cat.category.name}</li>
                  ))}
                </ul>
              </div>
              <h2 className="text-2xl font-bold">{elem.title}</h2>
              <p className="text-base" dangerouslySetInnerHTML={{ __html: elem.content }} />
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}