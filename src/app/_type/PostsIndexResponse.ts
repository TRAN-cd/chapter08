export type PostsIndexResponse = {
  posts: {
    id: number
    title: string
    content: string
    thumbnailImageKey: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }[]
}