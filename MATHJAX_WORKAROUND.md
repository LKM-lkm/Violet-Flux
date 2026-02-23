# MathJax + Nuxt Content MDC 兼容性解决方案

## 问题
Nuxt Content 的 MDC 解析器会将 `{...}` 当作组件语法处理，破坏 LaTeX 公式。

## 解决方案

### 方法 1：使用反斜杠转义（推荐）
在 Markdown 文件中，对花括号进行转义：

```markdown
- 单个字符：$x^2$, $a_i$
- 多个字符：$e^{i\theta}$ → $e^\{i\theta\}$
- 组合使用：$R_{ij}^{ab}$ → $R_\{ij\}^\{ab\}$
```

### 方法 2：使用 HTML 实体
```markdown
$A_{ij}$ → $A_&#123;ij&#125;$
```

### 方法 3：使用代码块（临时查看）
```markdown
`$A_{ij}$`
```

### 方法 4：创建 Math 组件
创建 `components/content/Math.vue`：

```vue
<template>
  <span v-html="content" class="math-inline"></span>
</template>

<script setup>
const props = defineProps(['content'])
</script>
```

在 Markdown 中使用：
```markdown
::math{content="$A_{ij}$"}
::
```

## 自动化脚本
创建一个脚本来自动转义 Markdown 文件中的 LaTeX：

```javascript
// scripts/escape-latex.js
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = glob.sync('content/**/*.md')

files.forEach(file => {
  let content = readFileSync(file, 'utf-8')
  
  // 转义 inline math 中的花括号
  content = content.replace(/\$([^\$]+)\$/g, (match, math) => {
    const escaped = math.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
    return `$${escaped}$`
  })
  
  // 转义 display math 中的花括号
  content = content.replace(/\$\$([^\$]+)\$\$/gs, (match, math) => {
    const escaped = math.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
    return `$$${escaped}$$`
  })
  
  writeFileSync(file, content)
})
```
