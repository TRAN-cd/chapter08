import { CategoriesSelect } from './CategoriesSelect'
import { Category } from '@/app/_type/Category'
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'
import { PostThumbnail } from "@/app/_components/PostThumbnail";
import { useForm, Controller } from "react-hook-form"

export type PostFormInputs = {
  title: string
  content: string
  thumbnailImageKey: string
  categories: Category[]
}

interface Props {
  mode: 'new' | 'edit'
  defaultValues?: PostFormInputs
  onSubmit: (data: PostFormInputs) => void
  onDelete?: () => void
  disabled: boolean;
}

export const PostForm = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  // react hook from の初期設定
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {
      isDirty,
      isValid,
      isSubmitting,
    },
  } = useForm<PostFormInputs>({
    defaultValues: defaultValues || {
      title: "",
      content: "",
      thumbnailImageKey: "",
      categories: [],
    },
    mode: "all",
  });

  // 画像キーを監視（プレビュー表示用）
  const thumbnailImageKey = watch("thumbnailImageKey");
  const title = watch("title");


  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from('post_thumbnail') // バケット名を指定
      .upload(filePath, file)

    if (error) {
      alert(error.message)
      return
    }

    setValue("thumbnailImageKey", data.path, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div>
      <form className="p-2.5 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

        <div className="flex flex-col gap-2">
          <label htmlFor="title">タイトル</label>
          <input
            id='title'
            // type="text"
            {...register("title", {
              required: "タイトルが入力されていません。",
            })}
            className="border border-b-gray-600 rounded-sm p-2"
            disabled={disabled || isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content">内容</label>
          <input
            id='content'
            // type="text"
            {...register("content", {
              required: "内容が入力されていません。",
            })}
            className="border border-b-gray-600 rounded-sm p-2"
            disabled={disabled || isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="thumbnailImageKey">サムネイル</label>
          <input
            // id='thumbnailImageKey'
            accept='image/*'
            onChange={handleImageChange}
            type="file"
            className="border border-b-gray-600 rounded-sm p-2"
            disabled={disabled || isSubmitting}
          />
          <input
            type="hidden"
            {...register("thumbnailImageKey", {
              required: "画像をアップロードしてください"
            })}
          />
          <PostThumbnail imageKey={thumbnailImageKey} alt={title} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="categories">カテゴリー</label>
          <Controller
            name="categories" // RHF内の変数名
            control={control}
            rules={{ required: "カテゴリーを選択してください" }}
            render={({ field }) => (
              // field内には { value, onChange, onBlur, ref } が入っている
              <CategoriesSelect
                selectedCategories={field.value}
                setSelectedCategories={field.onChange} // field.onChangeを渡すことでRHFと同期
                disabled={disabled || isSubmitting}
              />
            )}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-700 text-white rounded-lg cursor-pointer"
            disabled={!isDirty || !isValid || isSubmitting} >
            {mode === 'new' ? '作成' : '更新'}
          </button>

          {mode === 'edit' && (
            <button
              type="button"
              onClick={onDelete}
              className="pt-2 px-4 bg-red-700 text-white rounded-lg cursor-pointer"
              disabled={!isDirty || !isValid || isSubmitting}>
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  )
}