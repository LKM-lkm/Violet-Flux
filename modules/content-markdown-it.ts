import { defineNuxtModule } from '@nuxt/kit'
// @ts-ignore
import markdownItGithubAlerts from 'markdown-it-github-alerts'

export default defineNuxtModule({
  meta: {
    name: 'content-markdown-it',
    configKey: 'contentMarkdownIt'
  },
  setup(options, nuxt) {
    // 扩展 Nuxt Content 的 markdown 配置
    nuxt.hook('content:context', (contentContext) => {
      // @ts-ignore
      if (contentContext.markdown?.options) {
        // @ts-ignore
        const originalSetup = contentContext.markdown.options.setup
        // @ts-ignore
        contentContext.markdown.options.setup = (md) => {
          if (originalSetup) {
            originalSetup(md)
          }
          // 添加 GitHub Alerts 插件
          md.use(markdownItGithubAlerts)
        }
      }
    })
  }
})
