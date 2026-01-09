/**
 * Утилита для управления тактильным откликом (Haptic Feedback).
 * Использует navigator.vibrate API.
 * Проверяет настройку 'reading_enableHaptics' в localStorage.
 */

// Паттерны вибрации
export const HapticPatterns = {
  soft: 10, // Легкий отклик (нажатие кнопки)
  medium: 40, // Средний отклик (переключение)
  heavy: 70, // Сильный отклик
  success: [10, 30, 10], // Двойная пульсация (успех)
  error: [50, 50, 50], // Тройная пульсация (ошибка)
}

/**
 * Проверяет, включена ли вибрация в настройках.
 * По умолчанию (если настройки нет) - включена.
 */
const isHapticsEnabled = (): boolean => {
  if (typeof localStorage === 'undefined') return true
  const setting = localStorage.getItem('reading_enableHaptics')
  // Если настройки нет, считаем что включено. Если есть, проверяем не 'false'
  return setting !== 'false'
}

/**
 * Запускает вибрацию устройства
 * @param pattern Число (мс) или массив чисел (паттерн)
 */
export const vibrate = (pattern: number | number[] = 10) => {
  // 1. Проверяем настройку пользователя
  if (!isHapticsEnabled()) return

  // 2. Проверяем поддержку API
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch (e) {
      // Игнорируем ошибки (например, если браузер блокирует вибрацию без жеста пользователя)
      console.warn('Haptic feedback blocked or not supported', e)
    }
  }
}
