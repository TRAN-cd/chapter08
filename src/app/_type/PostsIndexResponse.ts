export type PostsIndexResponse = {
  posts: {
    id: number
    title: string
    content: string
    thumbnailUrl: string
    // createdAt: Date
    createdAt: string
    // updatedAt: Date
    updatedAt: string
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }[]
}