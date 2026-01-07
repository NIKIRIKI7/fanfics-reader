import { ref, computed, type CSSProperties } from 'vue'

interface UseMagneticOptions {
  /**
   * Сила притяжения.
   * 0.1 - слабое, 1.0 - элемент следует точно за курсором.
   * @default 0.3
   */
  strength?: number
}

export function useMagnetic(options: UseMagneticOptions = {}) {
  const { strength = 0.3 } = options
  
  const elementRef = ref<HTMLElement | null>(null)
  const position = ref({ x: 0, y: 0 })
  const isHovered = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!elementRef.value) return

    const { left, top, width, height } = elementRef.value.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    position.value = { x: deltaX, y: deltaY }
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    position.value = { x: 0, y: 0 }
  }

  const magneticStyle = computed<CSSProperties>(() => ({
    transform: `translate(${position.value.x}px, ${position.value.y}px)`,
    // Убираем транзишн при наведении для мгновенного отклика (физика магнита),
    // возвращаем при уходе для плавного возврата на место (физика пружины).
    // Также сохраняем транзишны для цветов, чтобы не ломать hover-эффекты tailwind.
    transition: isHovered.value
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.3s, border-color 0.3s, color 0.3s',
    willChange: 'transform' // Оптимизация рендеринга
  }))

  return {
    elementRef,
    magneticStyle,
    handleMouseMove,
    handleMouseLeave
  }
}