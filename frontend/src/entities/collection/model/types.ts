export type CollectionIcon = 'default' | 'heart' | 'clock' | 'star' | 'flame' | 'skull' | 'book'

export interface Collection {
  id: string
  title: string
  icon: CollectionIcon
  workIds: string[]
  isSystem?: boolean // Системные папки (например, "All" или "Read Later") нельзя удалить
  description?: string
}