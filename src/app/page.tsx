'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type {Post} from "./_type/Post.types"

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};


export default function PostComponent(){
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
      const data = await response.json();
      setPosts(data.posts);
    }
  
    fetcher();
  }, []);
  
  if ( posts.length === 0) {
    return (
      <p>記事を読み込み中です...</p>
    )
  };

  return (
    <>
      <div className="p-[10px]">
        <h1 className="text-xl font-extrabold tracking-wide">記事一覧</h1>
        {posts.map((elem, index) => (
          <Link href={`/post/${elem.id}`} className="flex flex-col gap-[10px] pb-[10px] sm:flex-row" key={index} id={elem.id}>
            <div className="max-w-full w-full sm:max-w-[50%]">
              <Image src={elem.thumbnailUrl} alt="" width={800} height={400} className="w-full align-bottom"/>
            </div>
            <div className="flex flex-col gap-[10px] w-full sm:w-[50%]">
              <div className="flex items-center gap-[10px]">
                <p>{formatDate(elem.createdAt)}</p>
                <ul className="flex  gap-[10px]">
                  {elem.categories.map((cat, i) => (
                    <li key={i} className="bg-gray-300 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[50px]">{cat}</li>
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