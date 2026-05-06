'use client';

import { useParams } from 'next/navigation';
import type { PostShowResponse } from "@/app/_type/PostShowResponse";
import { supabase } from '@/app/_libs/supabase';
import { PostThumbnail } from "@/app/_components/PostThumbnail";
import useSWR from 'swr';
import { usePublicFetch } from "@/app/_hooks/usePublicFetch";

const imageFetcher = async (key: string) => {
  const { data } = supabase.storage
    .from('post_thumbnail')
    .getPublicUrl(key);
  return data.publicUrl;
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function Post() {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = usePublicFetch<PostShowResponse>(`/api/posts/${id}`);
  const post = data?.post;

  const { data: thumbnailImageUrl } = useSWR(
    post?.thumbnailImageKey ? post.thumbnailImageKey : null,
    imageFetcher
  )

  if (isLoading) return <p>記事を読み込み中です...</p>;
  if (error) return <p className="p-4 text-red-500">エラーが発生しました。</p>;
  if (!post) return <p>データがありません。</p>;

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