export default defineNuxtRouteMiddleware((to, from) => {
  // 检查是否以 / 结尾或包含 //
  if (to.path !== '/' && (to.path.endsWith('/') || to.path.includes('//'))) {
    // 移除所有的连续 //，并移除末尾的 /
    let newPath = to.path.replace(/\/+/g, '/').replace(/\/+$/, '')
    // 如果剥离后变成了空字符串，说明原本是 / 或者 // 等
    if (!newPath) newPath = '/'
    
    // 如果 URL 有变化，执行 301 永久重定向
    if (newPath !== to.path) {
      if (to.query && Object.keys(to.query).length > 0) {
        return navigateTo({ path: newPath, query: to.query }, { redirectCode: 301 })
      }
      return navigateTo(newPath, { redirectCode: 301 })
    }
  }
})
