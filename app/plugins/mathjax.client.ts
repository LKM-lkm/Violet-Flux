export default defineNuxtPlugin(() => {
  // 等待 MathJax 加载
  const waitForMathJax = () => {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now()
      const check = () => {
        if (window.MathJax?.typesetPromise) {
          resolve(window.MathJax)
        } else if (Date.now() - startedAt >= 10000) {
          reject(new Error('MathJax did not become ready within 10 seconds'))
        } else {
          setTimeout(check, 100)
        }
      }

      check()
    })
  }
  
  // 渲染 MathJax
  const renderMathJax = async () => {
    try {
      const MathJax = await waitForMathJax()
      await MathJax.typesetPromise()
      console.log('MathJax rendered successfully')
    } catch (err) {
      console.error('MathJax rendering error:', err)
    }
  }
  
  // 页面加载后渲染
  if (process.client) {
    // 立即尝试渲染
    renderMathJax()
    
    // 路由变化时重新渲染
    const router = useRouter()
    router.afterEach(() => {
      setTimeout(renderMathJax, 500)
    })
  }
  
  return {
    provide: {
      renderMathJax
    }
  }
})
