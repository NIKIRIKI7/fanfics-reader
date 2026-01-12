export interface Comment {
  id: string
  workId: string
  author: string
  avatarUrl?: string
  text: string
  date: string
  likes: number
}