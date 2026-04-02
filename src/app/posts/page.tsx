'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type {MicroCmsPost} from "../_type/MicroCmsPost";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};


export default function PostComponent(){
  const [posts, setPosts] = useState<MicroCmsPost[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const response = await fetch('https://w0wrfq7tkg.microcms.io/api/v1/posts', {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      })
      const { contents } = await response.json();
      setPosts(contents);
      setLoading(false)
    }
  
    fetcher();
  }, []);
  
  if (loading) return <p>記事を読み込み中です...</p>;
  if (posts.length ===0) return <p>データがありません。</p>;

  return (
    <>
      <div className="p-[10px]">
        <h1 className="text-xl font-extrabold tracking-wide">記事一覧</h1>
        {posts.map((elem, index) => (
          <Link href={`/posts/${elem.id}`} className="flex flex-col gap-[10px] pb-[10px] sm:flex-row" key={index} id={elem.id}>
            <div className="max-w-full w-full sm:max-w-[50%]">
              <Image src={elem.thumbnail.url} alt="" width={800} height={400} className="w-full align-bottom"/>
            </div>
            <div className="flex flex-col gap-[10px] w-full sm:w-[50%]">
              <div className="flex items-center gap-[10px]">
                <p>{formatDate(elem.createdAt)}</p>
                <ul className="flex  gap-[10px]">
                  {elem.categories.map((cat, i) => (
                    <li key={i} className="bg-gray-300 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[50px]">{cat.name}</li>
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