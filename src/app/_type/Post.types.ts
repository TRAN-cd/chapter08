// export type Post = {
//   id: string,
//   title: string,
//   thumbnailUrl: string,
//   createdAt: string,
//   categories: string[],
//   content: string
// }

export type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  postCategories: {
    category: { id: string; name: string }
  }[]
  thumbnailUrl: string
}