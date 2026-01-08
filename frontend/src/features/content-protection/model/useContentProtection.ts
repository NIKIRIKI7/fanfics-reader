import { onMounted, onUnmounted } from 'vue';

export function useContentProtection(enable: boolean = true) {
  const preventContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    // Опционально: показать тост
    // notifications.showToast('Secure Terminal: Context menu disabled', 'warning');
  };

  const preventCopy = (e: ClipboardEvent) => {
    e.preventDefault();
  };

  const preventDevToolsAndShortcuts = (e: KeyboardEvent) => {
    // Разрешаем стандартные действия в инпутах (если пользователь пишет коммент)
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Блокировка F12
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // Блокировка сочетаний клавиш (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+C)
    if (e.ctrlKey || e.metaKey) { // metaKey для Mac
      const key = e.key.toLowerCase();

      // c = copy, u = view source, s = save, i/j = devtools
      if (['c', 'u', 's', 'p'].includes(key)) {
        e.preventDefault();
      }

      if (e.shiftKey && ['i', 'j', 'c'].includes(key)) {
        e.preventDefault();
      }
    }
  };

  onMounted(() => {
    if (!enable) return;

    // Блокируем контекстное меню
    document.addEventListener('contextmenu', preventContextMenu);

    // Блокируем копирование
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);

    // Блокируем клавиши
    document.addEventListener('keydown', preventDevToolsAndShortcuts);
  });

  onUnmounted(() => {
    document.removeEventListener('contextmenu', preventContextMenu);
    document.removeEventListener('copy', preventCopy);
    document.removeEventListener('cut', preventCopy);
    document.removeEventListener('keydown', preventDevToolsAndShortcuts);
  });

  // Возвращаем CSS класс для запрета выделения
  return {
    protectedClass: 'select-none pointer-events-auto'
  };
}
