---
tags:
  - AI
  - Cloudflare
  - Nuxt
description: 通过 Cloudflare Worker + Workers AI 为 Violet Flux 博客部署 AI 摘要系统，使用 Qwen3 模型生成中文博文摘要。
date: 2026-10-10
---
# Cloudflare Worker AI 摘要设置指南

本文介绍如何通过 Cloudflare Worker 部署 Violet Flux 博客的 AI 摘要系统。系统使用 Workers AI 的 `@cf/qwen/qwen3-30b-a3b-fp8` 模型，在 Cloudflare 边缘节点生成博文摘要。前端通过 Nuxt 服务端代理转发请求，并在代理不可用时回退到 Worker 直连。

## 1. 创建 Cloudflare Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 导航至 **计算(Workers & Pages)** → **创建应用程序**
3. 选择 **Create Worker**，命名为 `vfs`（或自定义），点击 **部署**
4. 点击 **编辑代码**

## 2. Worker 脚本

将以下代码粘贴到 Worker 的 `index.js` 中。该版本包含 CORS 白名单、输入校验和改进的 system prompt：

```javascript
// Cloudflare Worker — AI Summary for Violet Flux
// 部署到: vfs.likem.cc.cd
// 模型: @cf/qwen/qwen3-30b-a3b-fp8

const ALLOWED_ORIGINS = ["https://violet-flux.pages.dev"];

const PAGES_PREVIEW = /^https:\/\/[a-z0-9-]+\.violet-flux\.pages\.dev$/;
const LOCAL_DEV = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function isAllowedOrigin(origin) {
  return (
    ALLOWED_ORIGINS.includes(origin) ||
    PAGES_PREVIEW.test(origin) ||
    LOCAL_DEV.test(origin)
  );
}

function corsHeaders(request) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  const origin = request.headers.get("Origin") || "";
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method === "GET") {
      return json({ status: "ok" }, 200, request);
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(request),
      });
    }

    try {
      const { content } = await request.json();

      if (typeof content !== "string" || !content.trim()) {
        return json({ error: "Missing content" }, 400, request);
      }

      const aiResponse = await env.AI.run("@cf/qwen/qwen3-30b-a3b-fp8", {
        messages: [
          {
            role: "system",
            content:
              "你是一个博文摘要助手。请用100-150字的中文概括下面这篇文章的主要内容。要求：1. 准确提炼文章的核心主题和关键信息，让读者快速了解文章在讲什么；2. 语言简洁明了、通顺自然，不要使用空泛的修辞或抽象的文学化表达；3. 直接输出摘要正文，不要加'摘要：'等前缀，不要重复原文或代码片段。",
          },
          { role: "user", content: content.slice(0, 3000) },
        ],
      });

      const summary =
        aiResponse.response ||
        aiResponse.choices?.[0]?.message?.content ||
        null;

      if (!summary) {
        return json({ error: "AI returned empty response" }, 502, request);
      }

      return json({ summary }, 200, request);
    } catch (error) {
      return json({ error: error.message || "Internal error" }, 500, request);
    }
  },
};
```

::callout{icon="i-heroicons-light-bulb" color="blue"}
**关于模型选择**：`@cf/qwen/qwen3-30b-a3b-fp8` 是 Qwen3 系列的 30B MoE 模型，中文表现优秀，适合摘要任务。如需更换模型，可参考 [Workers AI 模型列表](https://developers.cloudflare.com/workers-ai/models/)。
::

## 3. 启用 AI 绑定

1. 保存代码后进入 Worker 的 **设置** 选项卡
2. 选择 **变量**
3. 向下滚动到 **AI 绑定**
4. 点击 **添加绑定**，名称填 `AI`
5. 点击 **保存并部署**

## 4. 配置自定义域名（可选）

为 Worker 绑定自定义域名可以避免 `workers.dev` 被屏蔽的问题：

1. 在 Worker 的 **设置** → **触发器** 中找到 **自定义域名**
2. 添加 `vfs.likem.cc.cd`（替换为你自己的域名）
3. Cloudflare 会自动配置 DNS 记录

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
域名需已在 Cloudflare DNS 中托管。绑定后 Worker 将通过该域名提供服务。
::

## 5. 更新前端

前端需要更新两处配置，确保服务端代理和浏览器直连回退指向同一个 Worker：

### 服务端代理

```typescript
// server/api/ai-summary.post.ts
export default defineEventHandler(async (event) => {
  const { content } = await readBody(event)

  if (!content || typeof content !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing content" })
  }

  const WORKER_URL = "https://vfs.likem.cc.cd"

  try {
    const data = await $fetch<{ summary?: string; error?: string }>(WORKER_URL, {
      method: "POST",
      body: { content: content.slice(0, 3000) },
    })
    return data
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: "AI summary service unavailable",
    })
  }
})
```

### 前端组件

```vue
<!-- app/components/AiSummary.vue -->
<script setup lang="ts">
const props = defineProps<{ content: string }>()

const DIRECT_URL = "https://vfs.likem.cc.cd"

const summary = ref("")
const loading = ref(false)
const error = ref("")

const cacheKey = computed(() => `ai-summary:${props.content.slice(0, 100)}`)

async function generateSummary() {
  // 优先读取 localStorage 缓存
  const cached = localStorage.getItem(cacheKey.value)
  if (cached) {
    summary.value = cached
    return
  }

  loading.value = true
  try {
    // 优先走服务端代理（同源，无 CORS 问题）
    const data = await $fetch<{ summary?: string; error?: string }>(
      "/api/ai-summary",
      { method: "POST", body: { content: props.content } }
    )
    summary.value = data.summary ?? ""
    localStorage.setItem(cacheKey.value, summary.value)
  } catch {
    // 代理不可用时回退到 Worker 直连
    try {
      const data = await $fetch<{ summary?: string; error?: string }>(
        DIRECT_URL,
        { method: "POST", body: { content: props.content } }
      )
      summary.value = data.summary ?? ""
      localStorage.setItem(cacheKey.value, summary.value)
    } catch {
      error.value = "摘要生成失败"
    }
  } finally {
    loading.value = false
  }
}

onMounted(generateSummary)
</script>

<template>
  <div class="ai-summary">
    <div v-if="loading" class="ai-summary__loading">
      正在生成摘要…
    </div>
    <div v-else-if="error" class="ai-summary__error">
      {{ error }}
    </div>
    <div v-else-if="summary" class="ai-summary__content">
      <p>{{ summary }}</p>
    </div>
  </div>
</template>
```

::callout{icon="i-heroicons-information-circle" color="blue"}
两处 URL 必须保持一致，只改一处会导致代理和直连回退指向不同的 Worker。
::

## 工作原理

```
用户访问博文
    │
    ▼
AiSummary.vue 发送文章前 3000 字
    │
    ├──→ /api/ai-summary（Nuxt 服务端代理，同源）
    │       │
    │       └──→ vfs.likem.cc.cd（Worker）
    │               │
    │               └──→ Workers AI @cf/qwen/qwen3-30b-a3b-fp8
    │                       │
    │                       └──→ 返回中文摘要 JSON
    │
    └──→（代理失败时）直连 vfs.likem.cc.cd（回退路径）
    │
    ▼
前端接收摘要 → 打字机动画展示 → localStorage 缓存
```

- **前端**：博文加载时，`AiSummary.vue` 将文章前 3000 字发送到服务端代理
- **后端**：Worker 调用 Workers AI 生成摘要，模型为 Qwen3 30B MoE
- **缓存**：摘要存入 `localStorage`，避免重复调用消耗 AI 配额
- **回退**：服务端代理不可用时，前端直接请求 Worker（受 CORS 白名单保护）