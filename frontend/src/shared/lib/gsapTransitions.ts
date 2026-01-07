import gsap from 'gsap';

// Fade (Простое появление/исчезновение)
export const onEnterFade = (el: Element, done: () => void) => {
  gsap.fromTo(el, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.3, onComplete: done }
  );
};

export const onLeaveFade = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, duration: 0.3, onComplete: done });
};

// Slide Up (Всплытие снизу - для тостов и модалок)
export const onEnterSlideUp = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)', onComplete: done }
  );
};

export const onLeaveSlideUp = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', onComplete: done });
};

// Slide Down (Выпадание сверху - для хедера)
export const onEnterSlideDown = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { y: '-100%' },
    { y: '0%', duration: 0.4, ease: 'power2.out', onComplete: done }
  );
};

export const onLeaveSlideDown = (el: Element, done: () => void) => {
  gsap.to(el, { y: '-100%', duration: 0.3, ease: 'power2.in', onComplete: done });
};

// Scale Fade (Для попапов и меню настроек)
export const onEnterScale = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', onComplete: done }
  );
};

export const onLeaveScale = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.15, ease: 'power2.in', onComplete: done });
};

// Accordion (Раскрытие контента по высоте)
export const onEnterAccordion = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { height: 0, opacity: 0 },
    { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out', onComplete: done }
  );
};

export const onLeaveAccordion = (el: Element, done: () => void) => {
  gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done });
};