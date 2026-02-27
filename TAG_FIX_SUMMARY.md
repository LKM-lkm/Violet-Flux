# 标签掉落问题修复

## 问题描述

标签（如 `#互联网技术`、`#文件下载` 等）从卡片底部掉落到卡片外面。

## 根本原因

1. `.blog-card` 没有设置 `overflow: hidden` 和正确的 flex 布局
2. `.card-link` 使用 `display: block` 而不是 `display: flex`
3. `.card-inner` 缺少 `flex: 1` 确保占满空间
4. `.card-footer` 的 `margin-top: auto` 可能没有生效

## 应用的修复

### 1. 修复卡片容器
```css
.blog-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
```

### 2. 修复链接容器
```css
.card-link { 
  display: flex;          /* 改为 flex */
  flex-direction: column;
  height: 100%; 
  width: 100%;
}
```

### 3. 修复内容容器
```css
.card-inner { 
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  flex: 1;               /* 添加 flex: 1 */
  position: relative;
}
```

### 4. 强化 footer 样式
```css
.card-footer {
  margin-top: auto;
  display: flex !important;
  padding-top: 1rem;
  overflow: visible;
}

.tags-group {
  display: flex !important;
  overflow: visible;
}

.tag-chip {
  line-height: 1.2;
}

.read-more {
  min-width: 60px;
}
```

## 测试步骤

1. **清除缓存并重启**：
   ```bash
   # 停止开发服务器
   # 删除 .nuxt 目录
   rm -rf .nuxt
   # 重新启动
   npm run dev
   ```

2. **硬刷新浏览器**：
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **检查卡片**：
   - 访问 `http://localhost:3000/blog`
   - 标签应该在卡片内部底部
   - 标签和 "Read" 按钮应该在同一行

4. **使用开发者工具检查**：
   ```
   打开开发者工具 > Elements
   选择 .blog-card 元素
   检查：
   - display: flex ✓
   - overflow: hidden ✓
   - 子元素 .card-link 的 display: flex ✓
   - 子元素 .card-inner 的 flex: 1 ✓
   ```

## 预期效果

### 修复前（错误）：
```
┌─────────────────────────────────┐
│ Great Firewall                  │
│                                 │
│                      Read →    │
└─────────────────────────────────┘
#互联网技术 #文件下载  ← 掉到外面
```

### 修复后（正确）：
```
┌─────────────────────────────────┐
│ Great Firewall                  │
│                                 │
│ #互联网技术 #文件下载  Read →  │
└─────────────────────────────────┘
```

## 如果问题仍然存在

### 方法 1：检查 CSS 优先级

在浏览器开发者工具中：
1. 选择掉落的标签元素
2. 查看 Computed 样式
3. 找到 `position` 属性
4. 如果是 `absolute` 或其他非 `static` 值，说明有其他样式覆盖

### 方法 2：添加临时调试样式

在 `app/pages/blog/index.vue` 的 `<style scoped>` 中添加：

```css
/* 临时调试 - 显示边框 */
.blog-card {
  border: 2px solid red !important;
}

.card-link {
  border: 2px solid blue !important;
}

.card-inner {
  border: 2px solid green !important;
}

.card-footer {
  border: 2px solid orange !important;
  background: rgba(255, 165, 0, 0.1) !important;
}
```

这样可以清楚地看到每个容器的边界。

### 方法 3：强制重置样式

如果以上都不行，添加这个强制样式：

```css
.blog-card * {
  box-sizing: border-box !important;
}

.card-footer {
  position: relative !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}

.tags-group,
.tag-chip {
  position: static !important;
}
```

### 方法 4：检查全局样式

检查 `app/assets/design-system.css` 是否有影响：

```bash
# 搜索可能影响的样式
grep -r "position.*absolute" app/assets/
grep -r "position.*fixed" app/assets/
```

## 验证清单

- [ ] `.blog-card` 有 `display: flex` 和 `overflow: hidden`
- [ ] `.card-link` 有 `display: flex`
- [ ] `.card-inner` 有 `flex: 1`
- [ ] `.card-footer` 有 `margin-top: auto`
- [ ] 标签在卡片内部显示
- [ ] 标签和 "Read" 按钮在同一行
- [ ] 悬停效果正常工作

## 相关文件

- `app/pages/blog/index.vue` - 主要修复文件
- `app/assets/design-system.css` - 全局样式（检查是否有冲突）

## 技术说明

### Flexbox 布局层次

```
.blog-card (flex container)
  └─ .card-link (flex container)
      └─ .card-inner (flex container, flex: 1)
          ├─ .card-meta
          ├─ .card-title
          ├─ .card-desc
          └─ .card-footer (margin-top: auto)
              ├─ .tags-group (flex: 1)
              │   └─ .tag-chip (multiple)
              └─ .read-more (flex-shrink: 0)
```

### 关键 CSS 属性

- `display: flex` - 启用 flexbox 布局
- `flex-direction: column` - 垂直排列子元素
- `flex: 1` - 占据剩余空间
- `margin-top: auto` - 推到底部
- `overflow: hidden` - 防止内容溢出
- `position: relative` - 建立定位上下文

---

**修复日期**: 2026-02-24  
**状态**: 已应用，等待测试
