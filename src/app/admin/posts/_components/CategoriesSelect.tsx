import { Category } from '@/app/_type/Category'
import { useEffect, useState  } from 'react'

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
  disabled: boolean
}

export const CategoriesSelect = ({
  selectedCategories,
  setSelectedCategories,
  disabled
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([])

  const toggleCategory = (id: number) => {
    if (disabled) return;

    // すでに選択済みかチェック
    const exists = selectedCategories.some((category) => category.id === id)

    if (exists) {
      // 選択済みなら解除
      setSelectedCategories(
        selectedCategories.filter((category) => category.id !== id)
      )
      return
    }

    // 未選択なら追加
    const category = categories.find((c) => c.id === id)
    if (!category) return
    setSelectedCategories([...selectedCategories, category])
  }

  // コンポーネント表示時にDBから全カテゴリーを取得する
  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch('/api/admin/categories')
      const { categories } = await response.json()
      setCategories(categories)
    }

    fetcher()
  }, [])


  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.some(
            (selected) => selected.id === category.id
          )
          return (
            <button
              key={category.id}
              type="button" 
              onClick={() => toggleCategory(category.id)}
              className={[
                'rounded-full border px-3 py-1 text-sm',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800',
              ].join(' ')}>
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}