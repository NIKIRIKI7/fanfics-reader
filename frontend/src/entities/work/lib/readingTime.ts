/**
 * Рассчитывает время чтения в минутах.
 * Скорость чтения принята за 200 слов в минуту.
 */
export const getReadingTime = (words: number): string => {
  if (words <= 0) return '1 min read'
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}
