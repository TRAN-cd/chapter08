'use client';

import Image from "next/image";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import type { PostShowResponse } from "@/app/_type/PostShowResponse";
import { supabase } from '@/app/_libs/supabase';
import { PostThumbnail } from "@/app/_components/PostThumbnail";

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function Post() {
  const [post, setPosts] = useState<PostShowResponse["post"] | null>(null);
  const { id } = useParams();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPosts(data.post);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      }
    }

    fetcher();
  }, [id]);

  useEffect(() => {
    if (!post?.thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const { data } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey)

      setThumbnailImageUrl(data.publicUrl)
    }

    fetcher()
  }, [post?.thumbnailImageKey])


  if (!post) {
    return (
      <>
        <div className="p-2.5 w-full text-center">
          <p>記事を読み込み中です...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="p-2.5 max-w-[80%] w-full mx-auto">
        <div className="max-w-4/5 m-auto flex flex-col gap-2.5">
          <div className="w-full">
            <PostThumbnail imageKey={post.thumbnailImageKey} alt={post.title}/>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex items-center gap-2.5">
              <p className="">{formatDate(post.createdAt)}</p>
              <ul className="flex gap-2.5">
                {post.postCategories.map((cat, i) => (
                  <li key={i} className='bg-gray-300 pt-1.25 pb-1.25 pr-2.5 pl-2.5 rounded-[50px]'>{cat.category.name}</li>
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