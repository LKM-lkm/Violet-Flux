export default defineNuxtPlugin(() => {
  // 等待 MathJax 加载
  const waitForMathJax = () => {
    return new Promise((resolve) => {
      if (window.MathJax) {
        resolve(window.MathJax)
        return
      }
      
      const checkInterval = setInterval(() => {
        if (window.MathJax) {
          clearInterval(checkInterval)
          resolve(window.MathJax)
        }
      }, 100)
      
      // 超时保护
      setTimeout(() => {
        clearInterval(checkInterval)
        resolve(null)
      }, 10000)
    })
  }
  
  // 渲染 MathJax
  const renderMathJax = async () => {
    const MathJax = await waitForMathJax()
    if (MathJax && MathJax.typesetPromise) {
      try {
        await MathJax.typesetPromise()
        console.log('MathJax rendered successfully')
      } catch (err) {
        console.error('MathJax rendering error:', err)
      }
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
