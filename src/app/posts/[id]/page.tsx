'use client';

import Image from "next/image";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import type {MicroCmsPost} from "../../_type/MicroCmsPost";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function Post(){
  const [post, setPosts] = useState<MicroCmsPost | null>(null);

  const { id } = useParams();

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch(
        `https://w0wrfq7tkg.microcms.io/api/v1/posts/${id}`,
      {
        headers: {
          'X-MICROCMS-API-KEY': process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      },
      );
      const data = await response.json();
      setPosts(data);
    }
  
    fetcher();
  }, [id]);

  if (!post) {
    return (
      <>
        <div className="p-[10px] w-full text-center">
          <p>記事を読み込み中です...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="p-[10px] max-w-[80%] w-full mx-auto">
        <div className="flex flex-col gap-[10px]">
          <div className="w-full">
            <Image src={post.thumbnail.url} width={800} height={400} alt="w-full align-bottom" />
          </div>
          <div className="flex flex-col gap-[10px] w-full">
            <div className="flex items-center gap-[10px]">
              <p className="">{formatDate(post.createdAt)}</p>
              <ul className="flex gap-[10px]">
                {post.categories.map((cat, i) => (
                  <li key={i} className='bg-gray-300 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[50px]'>{cat.name}</li>
                ))}
              </ul>
            </div>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </>
  )
}