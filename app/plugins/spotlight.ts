/**
 * v-spotlight：鼠标跟随高光
 *
 * 挂到元素上之后，指针移动时会实时写入两个 CSS 变量：
 *   --spot-x / --spot-y   指针相对元素左上角的坐标
 * 元素自己用它们画一层径向渐变即可（全局的 .vf-spotlight 规则已经写好）。
 *
 * 只用到 mounted / unmounted，服务端不会执行，所以不需要 .client 后缀，
 * 这样 SSR 时也不会出现「无法解析指令」的警告。
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('spotlight', {
    mounted(el: HTMLElement) {
      // 光斑样式集中在 design-system.css 的 .vf-spotlight 里，指令只负责挂类名和写坐标
      el.classList.add('vf-spotlight')

      const update = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
        el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
      }

      el.addEventListener('pointermove', update, { passive: true })
      // 存下同一个函数引用，卸载时才能摘掉
      ;(el as any).__vfSpotlight = update
    },

    unmounted(el: HTMLElement) {
      el.classList.remove('vf-spotlight')
      const update = (el as any).__vfSpotlight
      if (update) {
        el.removeEventListener('pointermove', update)
        delete (el as any).__vfSpotlight
      }
    }
  })
})
