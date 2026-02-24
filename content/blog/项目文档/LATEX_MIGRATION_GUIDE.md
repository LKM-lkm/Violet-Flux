# LaTeX 语法迁移指南

## 为什么要迁移？

当前方案使用转义花括号（`\{` 和 `\}`）来避免与 Nuxt Content MDC 的 Vue 组件语法冲突。这种方案的问题：

- ❌ 破坏源文件可读性
- ❌ 不符合 LaTeX 标准
- ❌ 在其他编辑器中无法预览
- ❌ 增加编辑难度

## 新方案

使用 MathJax 官方推荐的标准 LaTeX 定界符：

- **行内公式**：`\(...\)` 代替 `$...$`
- **块级公式**：`\[...\]` 或 `$$...$$`

优势：

- ✅ 无需转义花括号
- ✅ 符合 LaTeX 标准
- ✅ 跨平台兼容
- ✅ 保持源文件可读性

## 迁移步骤

### 1. 运行转换脚本

```bash
npm run convert-latex
```

这个脚本会自动：
- 将 `$...$` 转换为 `\(...\)`
- 移除花括号转义：`\{` → `{`, `\}` → `}`
- 保留 `$$...$$` 块级公式

### 2. 检查转换结果

```bash
git diff
```

查看具体变化，确保转换正确。

### 3. 测试效果

```bash
npm run dev
```

访问 http://localhost:3000/blog/笔记/Mine/📝MathJax/MathJax%20LaTeX%20综合测试页面 查看效果。

### 4. 清理旧文件（可选）

如果一切正常，可以删除旧的转义脚本：

```bash
# 删除转义脚本
rm scripts/escape-latex-braces.mjs

# 删除自动转义 Hook
rm .kiro/hooks/auto-fix-latex.kiro.hook
```

## 语法对比

### 行内公式

**旧语法（需转义）：**
```markdown
爱因斯坦的质能方程 $E = mc^2$ 是一个著名的例子。
分数：$\frac\{1\}\{2\}$
```

**新语法（标准）：**
```markdown
爱因斯坦的质能方程 \(E = mc^2\) 是一个著名的例子。
分数：\(\frac{1}{2}\)
```

### 块级公式

**旧语法：**
```markdown
$
\int_\{-\infty\}^\{\infty\} e^\{-x^2\} dx = \sqrt\{\pi\}
$
```

**新语法：**
```markdown
\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]

或者使用双美元符号：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 常见问题

### Q: 为什么不继续使用 `$...$`？

A: `$...$` 在 Nuxt Content MDC 中会与 Vue 组件语法冲突，导致花括号被解析为组件绑定。使用 `\(...\)` 可以完全避免这个问题。

### Q: Obsidian 支持 `\(...\)` 语法吗？

A: 是的，Obsidian 同时支持 `$...$` 和 `\(...\)`。使用 `\(...\)` 可以保证跨平台兼容性。

### Q: 如果转换出错怎么办？

A: 使用 Git 恢复：
```bash
git checkout -- content/
```

### Q: 需要手动修改配置吗？

A: 不需要，`nuxt.config.ts` 已经更新为推荐配置。

## 参考资料

- [MathJax TeX Input Options](https://docs.mathjax.org/en/latest/options/input/tex.html)
- [MATHJAX_SOLUTION.md](./MATHJAX_SOLUTION.md) - 完整技术文档
- [MathJax LaTeX 综合测试页面](./content/blog/笔记/Mine/📝MathJax/MathJax%20LaTeX%20综合测试页面.md) - 使用新语法的示例

## 下一步

1. ✅ 运行 `npm run convert-latex` 转换现有文件
2. ✅ 检查 `git diff` 确认变化
3. ✅ 运行 `npm run dev` 测试效果
4. ✅ 如果一切正常，提交更改
5. ✅ 删除旧的转义脚本和 Hook（可选）

---

**注意**：转换脚本会修改所有 `.md` 文件，建议先提交当前更改，以便在出现问题时回滚。
