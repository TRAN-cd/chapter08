import React from 'react'
import { CategoriesSelect } from './CategoriesSelect'
import { Category } from '@/app/_type/Category'

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void

  content: string
  setContent: (content: string) => void

  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void

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
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  return (
    <form className="p-2.5 flex flex-col gap-6" onClick={onSubmit}>

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
        <label htmlFor="thumbnailUrl">サムネイルURL</label>
        <input
          id="thumbnailUrl"
          name="thumbnailUrl"
          type="text"
          className="border border-b-gray-600 rounded-sm p-2"
          onChange={(e) => (e.target.value)}
          value={thumbnailUrl}
          disabled={disabled} />
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
          {mode === 'new' ? '作成': '更新'}
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