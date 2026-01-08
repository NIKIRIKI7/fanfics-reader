export type WorkType = 'Original' | 'Fanfic' | 'Archive';
export type WorkStatus = 'Complete' | 'In Progress' | 'One-Shot';

export interface WorkStats {
  words: number;
  chapters: number;
  kudos: number;
  date: string;
  status: WorkStatus;
}

// Новые интерфейсы для музыки
export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string; // Ссылка на mp3 файл
  duration?: string;
}

export interface SceneSoundtrack {
  id: string; // ID на который мы ссылаемся в тексте
  title?: string; // Опциональный заголовок (например, "Atmosphere: Rain")
  tracks: Track[];
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
  soundtracks?: SceneSoundtrack[]; // Добавляем массив плейлистов
  authorAudioUrl?: string; // Ссылка на аудиофайл авторской озвучки
}