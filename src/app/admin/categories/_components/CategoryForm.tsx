import React from 'react'

interface Props {
  mode: 'new' | 'edit'
  name: string
  setName: (title: string) => void

  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  disabled: boolean;
}

export const CategoryForm = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  return (
    <form className="mb-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">カテゴリー</label>
        <input
          id="name"
          name="name"
          type="text"
          className="border border-b-gray-600 rounded-sm p-2"
          onChange={(e) => setName(e.target.value)}
          value={name}
          disabled={disabled} />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onSubmit}
          className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer" disabled={disabled}>
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (

          <button
            type="button"
            onClick={onDelete}
            className="p-t-2 px-4 bg-red-700 text-white rounded-lg cursor-pointer" disabled={disabled}>削除</button>
        )}
      </div>
    </form>
  )
}