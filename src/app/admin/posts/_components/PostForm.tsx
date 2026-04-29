import React, { useState, useEffect } from 'react'
import { CategoriesSelect } from './CategoriesSelect'
import { Category } from '@/app/_type/Category'
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'
import Image from "next/image";
interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void

  content: string
  setContent: (content: string) => void

  thumbnailImageKey: string
  setThumbnailImageKey: (thumbnailImageKey: string) => void

  categories: Category[]
  setCategories: (categories: Category[]) => void

  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  disabled: boolean;
}

export const PostForm = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled
}: Props) => {

  // アップロードした画像の表示する実装
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  // const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  // 画像アップロード機能
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return
    }

    // 選択された画像を取得
    const file = event.target.files[0]

    // ファイルパスを指定
    const filePath = `private/${uuidv4()}`

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // バケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path)
  }




  return (
    <form className="p-2.5 flex flex-col gap-6" onSubmit={onSubmit}>

      <div className="flex flex-col gap-2">
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          name="title"
          type="text"
          className="border border-b-gray-600 rounded-sm p-2"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={disabled} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="content">内容</label>
        <input
          id="content"
          name="content"
          type="text"
          className="border border-b-gray-600 rounded-sm p-2"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          disabled={disabled} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="thumbnailImageKey">サムネイルURL</label>
        <input
          id="thumbnailImageKey"
          name="thumbnailImageKey"
          type="file"
          className="border border-b-gray-600 rounded-sm p-2"
          onChange={handleImageChange}
          // value={thumbnailImageKey}
          disabled={disabled}
          accept='image/*' />

        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="categories">カテゴリー</label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
          disabled={disabled} />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer"
          disabled={disabled} >
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={onDelete}
            className="p-t-2 px-4 bg-red-700 text-white rounded-lg cursor-pointer"
            disabled={disabled}>
            削除
          </button>
        )}
      </div>
    </form>
  )
}