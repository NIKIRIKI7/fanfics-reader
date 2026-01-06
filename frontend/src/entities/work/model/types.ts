export type WorkType = 'Original' | 'Fanfic' | 'Archive';
export type WorkStatus = 'Complete' | 'In Progress' | 'One-Shot';

export interface WorkStats {
  words: number;
  chapters: number;
  kudos: number;
  date: string;
  status: WorkStatus;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  author: string;
  type: WorkType;

  // Новые поля
  rating: string;        // Например: "Слэш 16+", "G", "R"
  warnings: string[];    // Например: "Нецензурная лексика", "Смерть персонажа"
  fandom?: string;       // Только для фанфиков (Опционально)
  pairings?: string[];   // Только для фанфиков (Опционально)

  summary: string;
  tags: string[];
  coverUrl: string;
  stats: WorkStats;
  // Added content field
  content?: string;
}