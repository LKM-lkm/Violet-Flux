export default defineNuxtPlugin((nuxtApp) => {
  // MathJax 组件加载的就绪 Promise（只解析一次）。
  let readyPromise: Promise<any> | null = null
  // 排版任务队列：MathJax v4 对同一批节点并发 typesetPromise 会抛
  // "this.parent(...) is null"（官方 issue #3130），因此所有调用必须串行。
  let renderQueue: Promise<void> = Promise.resolve()

  // 等待 MathJax 加载，并等 v4 的 startup.promise 完成后再返回。
  // startup.typeset 为 false 时不会自动排版，但 pageReady 的初始化仍要跑完，
  // 否则手动 typesetPromise 会和初始化抢同一批节点。
  const waitForMathJax = () => {
    if (readyPromise) return readyPromise
    readyPromise = new Promise((resolve, reject) => {
      const startedAt = Date.now()
      const check = () => {
        const MJ = (window as any).MathJax
        if (MJ?.typesetPromise) {
          const startup = MJ.startup?.promise
          if (startup && typeof startup.then === 'function') {
            startup.then(() => resolve(MJ), reject)
          } else {
            resolve(MJ)
          }
        } else if (Date.now() - startedAt >= 10000) {
          reject(new Error('MathJax did not become ready within 10 seconds'))
        } else {
          setTimeout(check, 100)
        }
      }

      check()
    })
    return readyPromise
  }

  // 串行化排版：页面 onMounted、插件 app:mounted、路由切换都会调用，
  // 这里把它们排成一条链，避免并发排版同一批 DOM。
  const renderMathJax = (): Promise<void> => {
    renderQueue = renderQueue.then(async () => {
      try {
        const MathJax = await waitForMathJax()
        await MathJax.typesetPromise()
        console.log('MathJax rendered successfully')
      } catch (err) {
        console.error('MathJax rendering error:', err)
      }
    })
    return renderQueue
  }

  // 等 Vue 完成首次挂载后再改写 DOM，避免干扰 SSR hydration。
  nuxtApp.hook('app:mounted', () => {
    void renderMathJax()
  })

  const router = useRouter()
  router.afterEach(() => {
    setTimeout(() => void renderMathJax(), 500)
  })

  return {
    provide: {
      renderMathJax
    }
  }
})
