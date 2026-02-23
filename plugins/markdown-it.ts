import MarkdownIt from 'markdown-it'
// @ts-ignore
import markdownItGithubAlerts from 'markdown-it-github-alerts'

export default defineNuxtPlugin(() => {
  // 这个插件会在 Nuxt Content 初始化时配置 markdown-it
  return {
    provide: {
      markdownIt: () => {
        const md = new MarkdownIt({
          html: true,
          linkify: true,
          typographer: true,
          breaks: true
        })
        
        // 添加 GitHub Alerts 插件
        md.use(markdownItGithubAlerts)
        
        return md
      }
    }
  }
})
