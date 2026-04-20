export type Category = {
  id: number
  name: string
}

export type PostShowResponse = {
  post: {
    id: number
    title: string
    content: string
    thumbnailUrl: string
    // createdAt: Date
    createdAt: string
    // updatedAt: Date
    updatedAt: string
    postCategories: {
      category: Category
    }[]
  }
}