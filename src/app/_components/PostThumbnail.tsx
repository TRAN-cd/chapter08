'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from '@/app/_libs/supabase';

export const PostThumbnail = ({ imageKey, alt }: { imageKey: string, alt: string }) => {
  console.log("キーの中身:", imageKey);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  useEffect(() => {
    if (!imageKey) return;

    // すでにURLならそのままセット
    if (imageKey.startsWith("http")) {
      setThumbnailImageUrl(imageKey);
      return;
    }

    const fetcher = async () => {
      const { data } = supabase.storage.from('post_thumbnail').getPublicUrl(imageKey);
      setThumbnailImageUrl(data.publicUrl);
    };
    fetcher();
  }, [imageKey]);

  return (
    <Image
      src={thumbnailImageUrl ?? "https://placehold.jp/800x400.png"}
      alt={thumbnailImageUrl ? alt : "thumbnail"}
      width={800}
      height={400}
      className={`max-w-full align-bottom ${!thumbnailImageUrl ? "animate-pulse bg-gray-200" : ""}`}
    />
  );
};