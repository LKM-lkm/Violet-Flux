<template>
  <div class="blog-layout">
    <!-- 阅读进度条 -->
    <ClientOnly>
      <ReadingProgress />
    </ClientOnly>



    <div class="container page-container" :class="{ 'has-sidebar': tocLinks.length > 0 }">
      <!-- 侧边栏目录 -->
      <ClientOnly>
        <aside v-if="tocLinks.length" class="sidebar">
          <div class="toc-wrapper glass-card">
            <div class="toc-header">
              <Icon name="lucide:list" class="toc-icon" />
              <span class="toc-title">目录</span>
            </div>
            <nav class="toc">
              <div 
                class="active-indicator" 
                :style="{ transform: `translateY(${indicatorOffset}px)` }"
              ></div>
              
              <ul class="toc-list">
                <li 
                  v-for="link in tocLinks" 
                  :key="link.id" 
                  :class="{ active: activeId === link.id }"
                  :style="{ paddingLeft: `${(link.depth - 1) * 0.75}rem` }"
                  :id="`toc-${link.id}`"
                >
                  <a :href="`#${link.id}`" @click.prevent="scrollTo(link.id)" class="toc-link">
                    {{ link.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </ClientOnly>

      <!-- 主内容区 -->
      <main class="main-content" :class="{ 'no-sidebar': !tocLinks.length }">
        <article v-if="article">
          <header class="article-header">
            <div class="header-meta">
              <NuxtLink to="/blog" class="back-link">
                <Icon name="lucide:chevron-left" />
                返回文章列表
              </NuxtLink>
            </div>
            <h1 class="article-title">{{ article.stem }}</h1>
            <div class="article-meta" v-if="getTags(article).length">
              <span v-for="tag in getTags(article)" :key="tag" class="tag-label">
                #{{ tag }}
              </span>
            </div>

            <!-- AI 摘要 -->
            <AiSummary 
              v-if="article" 
              :content="JSON.stringify(article.body)" 
              :article-id="article.id" 
            />
          </header>
          
          <div class="article-body">
            <ContentRenderer :value="article" />
          </div>

          <!-- 文章导航（上一篇/下一篇） -->
          <ArticleNavigation :current-path="article.path" />

          <!-- 相关文章推荐 -->
          <RelatedArticles :article="article" :max-items="3" />

          <ClientOnly>
            <CwdComments :slug="article.path" />
          </ClientOnly>
        </article>
        
        <div v-else class="not-found">
          <div class="empty-icon-wrapper">
            <Icon name="lucide:ghost" class="empty-icon" />
          </div>
          <h1>内容未找到</h1>
          <p>您查找的内容不存在或已移动</p>
          <NuxtLink to="/blog" class="btn btn-primary">返回博客</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import { isDark, toggleDark } from '~/composables/useTheme'

const activeId = ref('')
const indicatorOffset = ref(0)
const mobileMenuOpen = ref(false)
const route = useRoute()

// 使用官方推荐的 queryCollectionItemSurroundings 获取上一页/下一页
const { data: surround } = await useAsyncData(`surround-${route.path}`, () => {
  return queryCollectionItemSurroundings('content', route.path)
})

const { data: article } = await useAsyncData(`article-v22-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  
  const normalize = (p) => {
    if (!p) return ''
    try {
      return decodeURIComponent(p)
        .normalize('NFC')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '')
    } catch (e) {
      return p.replace(/\/+/g, '/').replace(/\/$/, '').replace(/^\//, '')
    }
  }

  const cleanRoute = normalize(route.path)
  const relativeRoute = cleanRoute.replace(/^blog\//, '')

  if (cleanRoute === 'blog' || cleanRoute === '') {
    return null
  }

  let found = all.find(item => {
    const itemId = item.id.replace(/\.md$/, '').normalize('NFC')
    return itemId === relativeRoute || itemId === cleanRoute
  })

  if (!found) {
    found = all.find(item => {
      const itemPath = normalize(item.path)
      return itemPath === cleanRoute || itemPath === relativeRoute
    })
  }

  if (!found) {
    const routeStem = cleanRoute.split('/').pop()
    found = all.find(item => {
      const s = normalize(item.stem || item.path?.split('/').pop() || '')
      return s === routeStem || normalize(item.title) === routeStem
    })
  }

  return found || null
})

// 设置 SEO 元数据，确保浏览器标签页标题也使用文件名
useSeoMeta({
  title: () => article.value?.stem || article.value?.title || 'Loading...',
  ogTitle: () => article.value?.stem || article.value?.title,
  description: () => article.value?.description
})

const tocLinks = computed(() => {
  const rawLinks = article.value?.body?.toc?.links || []
  const links = []
  const flatten = (items) => {
    items.forEach(i => {
      links.push(i)
      if (i.children) flatten(i.children)
    })
  }
  flatten(rawLinks)
  return links
})

const getTags = (art) => {
  const tags = art.tags || art.meta?.tags || []
  return Array.isArray(tags) ? tags : []
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

const updateActiveHeading = () => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
  const scrollPosition = window.scrollY + 150
  let currentId = ''

  for (const heading of headings) {
    if (heading.offsetTop <= scrollPosition) {
      if (heading.id) currentId = heading.id
    } else {
      break
    }
  }

  if (currentId && currentId !== activeId.value) {
    activeId.value = currentId
    nextTick(() => {
      const activeTocItem = document.getElementById(`toc-${activeId.value}`)
      if (activeTocItem) {
        indicatorOffset.value = activeTocItem.offsetTop
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading)
  
  // 使用插件渲染 MathJax
  const { $renderMathJax } = useNuxtApp()
  if ($renderMathJax) {
    nextTick(() => {
      $renderMathJax()
    })
    
    // 延迟再次渲染确保 DOM 完全加载
    setTimeout(() => {
      $renderMathJax()
    }, 1000)
  }
  
  setTimeout(updateActiveHeading, 600)
  
  // 处理 GitHub Alert - 客户端转换
  nextTick(() => {
    const processAlerts = () => {
      const blockquotes = document.querySelectorAll('.article-body blockquote')
      
      blockquotes.forEach(bq => {
        // 跳过已处理的
        if (bq.classList.contains('markdown-alert')) return
        
        const firstP = bq.querySelector('p:first-child')
        if (!firstP) return
        
        const text = firstP.textContent?.trim() || ''
        
        // Alert 类型映射
        const alertMap = {
          '[!NOTE]': { type: 'note', icon: 'ℹ️', title: 'Note' },
          '[!TIP]': { type: 'tip', icon: '💡', title: 'Tip' },
          '[!IMPORTANT]': { type: 'important', icon: '❗', title: 'Important' },
          '[!WARNING]': { type: 'warning', icon: '⚠️', title: 'Warning' },
          '[!CAUTION]': { type: 'caution', icon: '🚨', title: 'Caution' }
        }
        
        for (const [marker, config] of Object.entries(alertMap)) {
          if (text.startsWith(marker)) {
            // 转换为 GitHub Alert 结构
            bq.classList.add('markdown-alert', `markdown-alert-${config.type}`)
            
            // 创建标题
            const title = document.createElement('p')
            title.className = 'markdown-alert-title'
            title.innerHTML = `${config.icon} ${config.title}`
            
            // 移除 marker 并保留内容
            const content = text.replace(marker, '').trim()
            firstP.textContent = content
            
            // 插入标题
            bq.insertBefore(title, firstP)
            
            break
          }
        }
      })
    }
    
    // 处理图片尺寸和对齐
    const processImages = () => {
      const images = document.querySelectorAll('.article-body img')
      if (images.length === 0) return

      images.forEach(img => {
        const alt = img.getAttribute('alt')?.trim() || img.alt?.trim()
        if (alt && /^\d+$/.test(alt)) {
          // 1. 强制设置宽度
          img.style.setProperty('width', alt + 'px', 'important')
          img.style.setProperty('max-width', '100%', 'important')
          img.style.setProperty('display', 'inline-block', 'important')
          img.style.setProperty('vertical-align', 'middle', 'important')
          img.setAttribute('alt', '')
          
          // 2. 向上处理容器对齐
          let parent = img.parentElement
          while (parent && !parent.classList.contains('article-body')) {
            parent.style.setProperty('text-align', 'left', 'important')
            
            // 如果段落内容基本只有图片（或者是我们要隐藏的数字），则允许行内排列
            if (parent.tagName === 'P' || parent.tagName === 'DIV') {
              const text = parent.textContent.trim()
              if (text === '' || text === alt) {
                parent.style.setProperty('display', 'inline-block', 'important')
                parent.style.setProperty('vertical-align', 'middle', 'important')
                parent.style.setProperty('margin-right', '1rem', 'important')
              } else {
                parent.style.setProperty('display', 'block', 'important')
              }
            }
            parent = parent.parentElement
          }
          
          // 3. 递归查找并隐藏数字标题
          const hideNumeric = (el) => {
            if (!el) return false
            if (el.textContent.trim() === alt) {
              el.style.setProperty('display', 'none', 'important')
              return true
            }
            return false
          }

          // 检查同级元素
          let nextSib = img.nextElementSibling
          while (nextSib) {
            if (hideNumeric(nextSib)) break
            nextSib = nextSib.nextElementSibling
          }

          // 检查父级的同级元素
          let p = img.parentElement
          while (p && !p.classList.contains('article-body')) {
            let nextP = p.nextElementSibling
            if (hideNumeric(nextP)) break
            p = p.parentElement
          }
        }
      })
    }

    // 立即处理
    processAlerts()
    processImages()
    
    // 启动一个短期定时器，确保动态内容也被处理
    const timer = setInterval(processImages, 300)
    setTimeout(() => clearInterval(timer), 8000)
    
    // 监听内容变化
    const observer = new MutationObserver(() => {
      processAlerts()
      processImages()
    })
    const articleBody = document.querySelector('.article-body')
    if (articleBody) {
      observer.observe(articleBody, { childList: true, subtree: true })
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})

// 关闭移动菜单当路由改变
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}



/* === 布局 === */
.page-container {
  padding: var(--space-3xl) var(--space-lg);
  position: relative;
  z-index: 2;
}

.page-container.has-sidebar {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-3xl);
  align-items: start;
}

/* === 侧边栏 === */
.sidebar {
  position: sticky;
  top: calc(70px + var(--space-lg));
  height: fit-content;
  max-height: calc(100vh - 70px - var(--space-2xl));
  overflow-y: auto;
}

.toc-wrapper {
  padding: var(--space-lg);
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.toc-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(180, 151, 215, 0.08) 0%,
    rgba(194, 169, 228, 0.05) 35%,
    transparent 65%
  );
  opacity: 0.5;
  border-radius: var(--radius-xl);
  pointer-events: none;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-light);
}

.toc-icon {
  color: var(--primary);
  font-size: var(--text-lg);
}

.toc-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.toc {
  position: relative;
}

.active-indicator {
  position: absolute;
  left: 0;
  width: 3px;
  height: 24px;
  background: linear-gradient(180deg, #b497d7, #9163c0);
  box-shadow: 0 0 12px rgba(180, 151, 215, 0.6);
  transition: transform var(--duration-normal) var(--ease-out);
  border-radius: var(--radius-sm);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-link {
  display: block;
  padding: var(--space-xs) var(--space-sm);
  padding-left: var(--space-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  line-height: 1.5;
  transition: all var(--duration-fast);
  border-radius: var(--radius-sm);
}

.toc-link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.toc-list li.active .toc-link {
  color: var(--primary);
  font-weight: 600;
  text-shadow: 0 0 8px rgba(180, 151, 215, 0.3);
}

/* === 主内容 === */
.main-content {
  min-width: 0;
}

.main-content.no-sidebar {
  max-width: 800px;
  margin: 0 auto;
}

/* === 文章头部 === */
.article-header {
  margin-bottom: var(--space-3xl);
}

.header-meta {
  margin-bottom: var(--space-lg);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all var(--duration-fast);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
}

.back-link:hover {
  color: var(--primary);
  background: var(--bg-secondary);
}

.article-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  line-height: 1.1;
  margin-bottom: var(--space-lg);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, 
    var(--text-primary) 0%,
    #b497d7 50%,
    #9163c0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.article-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 140px;
  height: 3px;
  background: linear-gradient(90deg, 
    #b497d7 0%,
    #c2a9e4 50%,
    transparent 100%
  );
  border-radius: var(--radius-sm);
  box-shadow: 0 0 16px rgba(180, 151, 215, 0.6);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-md);
}

.tag-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--primary);
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.1), 
    rgba(194, 169, 228, 0.15)
  );
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  backdrop-filter: blur(8px);
  transition: all var(--duration-fast);
  position: relative;
  overflow: hidden;
}

.tag-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.tag-label:hover {
  background: linear-gradient(135deg, #b497d7, #a682cf);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.5);
  transform: translateY(-2px);
}

.tag-label:hover::before {
  left: 100%;
}

/* === 文章内容 === */
.article-body {
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--text-primary);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text-primary);
  margin-top: var(--space-3xl);
  margin-bottom: var(--space-lg);
  scroll-margin-top: 100px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

/* 隐藏正文中的第一个一级标题，因为它已经显示在头部了 */
.article-body :deep(h1:first-child) {
  display: none;
}

.article-body :deep(h2) {
  font-size: var(--text-4xl);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-light);
}

.article-body :deep(h3) {
  font-size: var(--text-3xl);
}

.article-body :deep(h4) {
  font-size: var(--text-2xl);
}

.article-body :deep(p) {
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.article-body :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all var(--duration-fast);
  position: relative;
  background: linear-gradient(
    to right,
    var(--primary-glow),
    var(--primary-glow)
  );
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left bottom;
}

.article-body :deep(a:hover) {
  border-bottom-color: var(--primary);
  background-size: 100% 100%;
  color: var(--primary-hover);
  text-shadow: 0 0 8px var(--primary-glow);
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--primary);
  background: linear-gradient(135deg,
    rgba(250, 248, 252, 0.9) 0%,
    rgba(243, 238, 248, 0.7) 40%,
    rgba(235, 228, 242, 0.6) 70%,
    rgba(235, 228, 242, 0.5) 100%
  );
  padding: var(--space-lg) var(--space-xl);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  font-style: italic;
  margin: var(--space-xl) 0;
  color: var(--text-secondary);
  box-shadow: var(--shadow-md),
              inset 4px 0 0 var(--primary);
  position: relative;
  overflow: hidden;
}

.article-body :deep(blockquote)::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 80px;
  color: var(--primary);
  opacity: 0.1;
  font-family: Georgia, serif;
  line-height: 1;
}

.article-body :deep(blockquote)::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle at bottom right,
    rgba(180, 151, 215, 0.15),
    transparent 70%
  );
  opacity: 0.6;
  pointer-events: none;
}

.article-body :deep(code:not(pre code)) {
  background: var(--bg-secondary);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
  color: var(--primary);
  font-weight: 500;
  font-family: var(--font-mono);
  border: 1px solid var(--border-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.article-body :deep(pre) {
  background: var(--code-bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
  box-shadow: var(--shadow-md),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  white-space: pre; /* 保留换行和空格 */
}

.article-body :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
  font-size: inherit;
  font-weight: normal;
  display: block;
  color: var(--code-text);
  white-space: pre; /* 保留换行和空格 */
  overflow-wrap: normal;
  word-break: normal;
}

/* Shiki 语法高亮样式 */
.article-body :deep(pre code .line) {
  display: block; /* 改为 block 确保换行 */
  min-height: 1.5em;
  line-height: 1.7;
}

/* 确保 Shiki 的 token 样式正常显示 */
.article-body :deep(pre code span) {
  font-family: inherit;
}

/* 如果没有高亮，至少保证可读性 */
.article-body :deep(pre code:not([class*="language-"])) {
  color: var(--code-text);
}

.article-body :deep(pre)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-glow),
    transparent
  );
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: var(--space-lg) 0;
  padding-left: var(--space-xl);
  list-style-position: outside;
}

.article-body :deep(ul) {
  list-style-type: disc;
}

.article-body :deep(ol) {
  list-style-type: decimal;
}

.article-body :deep(li) {
  margin-bottom: var(--space-sm);
  padding-left: var(--space-xs);
}

.article-body :deep(ul ul) {
  list-style-type: circle;
  margin-top: var(--space-xs);
}

.article-body :deep(ul ul ul) {
  list-style-type: square;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md),
              0 0 30px var(--primary-glow);
  margin: 0.5rem 0;
  display: inline-block;
  border: 1px solid var(--border-light);
  transition: all var(--duration-normal);
  vertical-align: middle;
}

.article-body :deep(img:hover) {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg),
              0 0 50px var(--primary-glow);
}

/* 优化图片下方的文字（如标题/描述）间距 */
.article-body :deep(p:has(img)),
.article-body :deep(li:has(img)),
.article-body :deep(div:has(img)) {
  margin-bottom: 0.25rem;
  text-align: left !important;
}

.article-body :deep(p:has(img) + p) {
  margin-top: 0;
  font-size: 0.9em;
  color: var(--text-secondary);
  text-align: left !important; 
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-xl) 0;
  font-size: var(--text-base);
}

.article-body :deep(th),
.article-body :deep(td) {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-light);
  text-align: left;
}

.article-body :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

/* GitHub Alert 样式 */
.article-body :deep(.markdown-alert) {
  padding: 0.75rem 1rem;
  margin: 1.5rem 0;
  border-left: 0.25rem solid;
  border-radius: 0.375rem;
  background: var(--bg-secondary);
}

.article-body :deep(.markdown-alert-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.article-body :deep(.markdown-alert-note) {
  border-left-color: #0969da;
  background: rgba(9, 105, 218, 0.05);
}

.article-body :deep(.markdown-alert-note .markdown-alert-title) {
  color: #0969da;
}

.article-body :deep(.markdown-alert-tip) {
  border-left-color: #1a7f37;
  background: rgba(26, 127, 55, 0.05);
}

.article-body :deep(.markdown-alert-tip .markdown-alert-title) {
  color: #1a7f37;
}

.article-body :deep(.markdown-alert-important) {
  border-left-color: #8250df;
  background: rgba(130, 80, 223, 0.05);
}

.article-body :deep(.markdown-alert-important .markdown-alert-title) {
  color: #8250df;
}

.article-body :deep(.markdown-alert-warning) {
  border-left-color: #d97706;
  background: rgba(217, 119, 6, 0.05);
}

.article-body :deep(.markdown-alert-warning .markdown-alert-title) {
  color: #d97706;
}

.article-body :deep(.markdown-alert-caution) {
  border-left-color: #cf222e;
  background: rgba(207, 34, 46, 0.05);
}

.article-body :deep(.markdown-alert-caution .markdown-alert-title) {
  color: #cf222e;
}

/* 暗色模式 */
:root.dark .article-body :deep(.markdown-alert-note) {
  border-left-color: #539bf5;
  background: rgba(83, 155, 245, 0.1);
}

:root.dark .article-body :deep(.markdown-alert-note .markdown-alert-title) {
  color: #539bf5;
}

:root.dark .article-body :deep(.markdown-alert-tip) {
  border-left-color: #3fb950;
  background: rgba(63, 185, 80, 0.1);
}

:root.dark .article-body :deep(.markdown-alert-tip .markdown-alert-title) {
  color: #3fb950;
}

:root.dark .article-body :deep(.markdown-alert-important) {
  border-left-color: #a371f7;
  background: rgba(163, 113, 247, 0.1);
}

:root.dark .article-body :deep(.markdown-alert-important .markdown-alert-title) {
  color: #a371f7;
}

:root.dark .article-body :deep(.markdown-alert-warning) {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

:root.dark .article-body :deep(.markdown-alert-warning .markdown-alert-title) {
  color: #f59e0b;
}

:root.dark .article-body :deep(.markdown-alert-caution) {
  border-left-color: #f85149;
  background: rgba(248, 81, 73, 0.1);
}

:root.dark .article-body :deep(.markdown-alert-caution .markdown-alert-title) {
  color: #f85149;
}

/* === 404 页面 === */
.not-found {
  text-align: center;
  padding: var(--space-3xl) 0;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.3;
}

.not-found h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  margin-bottom: var(--space-md);
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

/* === 响应式设计 === */
@media (max-width: 1024px) {
  .page-container.has-sidebar {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  
  .sidebar {
    position: relative;
    top: 0;
    max-height: none;
    order: 2;
  }
  
  .main-content {
    order: 1;
  }
  
  .article-title {
    font-size: var(--text-5xl);
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .page-container {
    padding: var(--space-2xl) var(--space-md);
  }
  
  .article-title {
    font-size: var(--text-4xl);
  }
  
  .article-body {
    font-size: var(--text-base);
  }
  
  .article-body :deep(h2) {
    font-size: var(--text-3xl);
  }
  
  .article-body :deep(h3) {
    font-size: var(--text-2xl);
  }
  
  .sidebar {
    display: none;
  }
  
  .toc-wrapper {
    padding: var(--space-md);
  }
}

@media (max-width: 640px) {
  .header {
    height: 60px;
  }
  
  .logo {
    font-size: var(--text-lg);
  }
  
  .article-title {
    font-size: var(--text-3xl);
  }
  
  .page-container {
    padding: var(--space-xl) var(--space-sm);
  }
  
  .article-body :deep(blockquote) {
    padding: var(--space-md) var(--space-lg);
  }
  
  .article-body :deep(pre) {
    font-size: var(--text-xs);
    padding: var(--space-md);
  }
}
</style>
