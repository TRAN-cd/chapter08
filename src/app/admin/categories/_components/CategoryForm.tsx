import React from 'react'
import { useForm } from "react-hook-form"

export type CategoryFormInputs = {
  name: string
}

interface Props {
  mode: 'new' | 'edit'
  defaultValues?: CategoryFormInputs
  onSubmit: (data: CategoryFormInputs) => void
  onDelete?: () => void
  disabled: boolean;
}

export const CategoryForm = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: {
      isDirty,
      isValid,
      isSubmitting,
      errors,
    },
  } = useForm<CategoryFormInputs>({
    defaultValues: defaultValues || {name: "" },
    mode: "all",
  });

  return (
    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">カテゴリー</label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "カテゴリーが入力されていません。",
            maxLength: { value: 20, message: "20文字以内で入力してください。" }
          })}
          className="border border-b-gray-600 rounded-sm p-2"
          disabled={disabled || isSubmitting} 
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer" 
          disabled={!isDirty || !isValid || isSubmitting || disabled}>
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (

          <button
            type="button"
            onClick={onDelete}
            className="px-4 bg-red-700 text-white rounded-lg cursor-pointer" disabled={isSubmitting}>削除</button>
        )}
      </div>
    </form>
  )
}