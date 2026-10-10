---
title: 内容写作
description: 在 Violet Flux 里写文章：路径规则、frontmatter、代码块、图片与链接
tags: [文档, 写作]
---

# 内容写作

## 文章放哪里

只有 `content/blog/**/*.md` 会被收录进 `content` 集合（见 `content.config.ts`），`assets/`、`.obsidian/` 等目录会被排除。

URL 由文件路径推导：`content/blog/` 之后的部分去掉 `.md` 就是路由，每段再经过一次 slugify。

| 文件 | URL |
| --- | --- |
| `content/blog/first-post.md` | `/blog/first-post` |
| `content/blog/docs/mathjax.md` | `/blog/docs/mathjax` |
| `content/blog/docs/index.md` | `/blog/docs`（`index` 会消掉） |
| `content/blog/笔记/Mine/🌐网络/IPDB.md` | `/blog/笔记/mine/🌐网络/ipdb` |

### 路径命名规则（容易踩坑）

`nuxt.config.ts` 里显式配置了：

```ts
content: {
  build: {
    pathMeta: {
      slugifyOptions: { remove: /[*+~.()'"!:@/]/g }
    }
  }
}
```

**这段配置不能删。** Nuxt Content 默认的 slugify 会把非 ASCII 字符整段删掉：`笔记` → 空字符串，于是 `/blog/笔记/...` 会退化成 `/blog//mine//ipdb` 这种残缺路径，多个文件还可能撞到同一个 path 互相覆盖。显式传 `remove` 之后只清理标点，中文、日文、emoji 都会保留。

规则总结：

- 大写字母转小写（`Mine` → `mine`）
- 空格转 `-`（`Great Firewall` → `great-firewall`）
- 标点按上面的正则清掉
- 中文 / emoji / 日文原样保留
- **改了这段配置后必须删掉 `.data/content/` 再构建**，否则缓存不会重新解析

::callout{icon="i-lucide-triangle-alert" color="warning"}
Windows 上构建时含中文/emoji 的目录名会让预渲染 HTML 的读写路径编码不一致（`项目文档` → `椤圭洰鏂囨。`），预渲染页会 500。所以**项目自己的文档放在 ASCII 目录 `content/blog/docs/` 下**；普通的笔记不受影响（它们走 SSR）。
::

## frontmatter

```markdown
---
title: 文章标题
description: 一句话描述，用于列表页和 SEO
tags: [标签1, 标签2]
date: 2026-10-10
image: /path/to/cover.png
---
```

`content.config.ts` 的 schema 里定义的是 `tags`（字符串数组）、`date`、`image`。

::callout{icon="i-lucide-info" color="info"}
标题在页面上优先取**文件名**而不是 `title`，但列表页和 SEO 会用 `title`，建议都写。
::

## 图片

图片放在文章同目录的 `assets/` 文件夹，用标准 Markdown 语法引用：

```markdown
![登录账号](assets/Pasted%20image%2020260501120057.png)
```

`ProseImg` 会负责渲染，附带这些行为：

- **alt 写纯数字时会被当成宽度**（像素），例如 `![50](assets/x.png)` 显示成 50px 宽
- alt 不是文件名时，会在图片下方渲染成说明文字
- 点击图片会打开液态玻璃样式的放大查看
- 自动懒加载

::callout{icon="i-lucide-info" color="info"}
如果图片不显示，先确认没有用 Obsidian 的 `![[assets/x.png]]` 嵌入语法——项目只配置了标准 Markdown 图片语法。有一篇旧笔记还在用这种写法。
::

## 代码块

````markdown
```typescript
const a = 1
```
````

**指定文件名**（会显示在代码块头部，保留原大小写）：

````markdown
```typescript [index.ts]
const a = 1
```
````

**高亮指定行**（支持单行和区间）：

````markdown
```js {1,3-5}
const a = 1
const b = 2
const c = 3
```
````

代码块的完整行为：

| 行为 | 说明 |
| --- | --- |
| 头部 | 恒定显示，左侧是语言图标 + 语言名（`JavaScript` / `C++` / `YAML` 这种规范写法，不全大写）+ 文件名，右侧是复制按钮 |
| 复制 | 失败时不会误报成功（非 HTTPS 会降级到 `execCommand`） |
| 行号 | **超过 10 行才显示**，短片段不显示 |
| 行高亮 | 由 `{1,3}` 这类标记触发 |
| 横向滚动 | 长行溢出时两侧有渐隐提示 |

语言必须在 `nuxt.config.ts` 的 `content.build.markdown.highlight.langs` 白名单里才会高亮，目前支持：`javascript`、`typescript`、`python`、`java`、`c`、`cpp`、`bash`、`shell`、`json`、`yaml`、`markdown`、`html`、`css`、`vue`、`jsx`、`tsx`。

配色主题是 `vitesse-light` / `vitesse-dark`。

## 链接

**站内链接请写绝对路径**：

```markdown
[项目指南](/blog/docs/project-guide)
```

Nuxt Content **不会**重写相对链接。写成 `[项目指南](./project-guide.md)` 会被浏览器解析成 `/blog/docs/project-guide.md`，直接 404。

**Wiki 链接**在 `nuxt.config.ts` 里配置了 `remark-wiki-link`：

```markdown
[[文章标题]]
```

会生成 `/blog/文章标题`。当前内容里还没用过这种写法，站内跳转建议直接用绝对路径。

## 数学公式

见 [MathJax 数学公式](/blog/docs/mathjax)。

## 提示框

见 [提示框 Callout](/blog/docs/callout)。

## 小工具

批量把旧 LaTeX 语法转成当前的标准语法：

```bash
npm run convert-latex
```
