---
tags:
  - AI
---

This guide will help you deploy the backend for your "Violet Flux" blog's AI summary system.

## 1. 创建一个 Cloudflare Worker

1. 登录你的 [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Overview** > **Create application**.
3. 选择 **Create Worker**, give it a name (e.g., `violet-flux-ai`), and click **Deploy**.
4. Click **Edit Code**.

## 2. Worker Script

Copy and paste the following code into your Worker's `index.js` (or `index.ts`):

```javascript
export default {
  async fetch(request, env) {
    // 1. Handle CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // You can change this to your production domain later
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { content } = await request.json();

      if (!content) {
        return new Response("Missing content", { status: 400 });
      }

      // 2. Call Cloudflare AI (using Llama 3)
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { 
            role: "system", 
            content: "你是一个专业的博文摘要助手。请用一段约100-150字的中文总结下面这篇文章的核心内容。语气要优雅、精准，符合'紫流 (Violet Flux)'的科技与哲学美感。直接输出摘要内容，不要有'摘要：'等前缀。严禁直接输出原文或者重复代码。" 
          },
          { role: "user", content: content },
        ],
      });

      const summary = response.response || response.choices?.[0]?.message?.content;

      // 3. Return JSON response
      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
```

## 3. Enable AI Binding

1. Save the code and go back to the Worker's **Settings** tab.
2. Select **Variables**.
3. Scroll down to **AI Bindings**.
4. Click **Add Binding**.
5. Give it the name `AI`.
6. Click **Save and Deploy**.

## 4. 最后步骤: Update Frontend

Once your Worker is deployed, copy its URL and update the `WORKER_URL` constant in:
`app/components/AiSummary.vue` (around line 43).

```javascript
const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev'
```

---

## How it works

1. **Frontend**: When a blog post loads, `AiSummary.vue` sends the first 3000 characters of the blog content to your Worker.
2. **Backend**: The Worker uses Cloudflare's serverless AI to generate a concise summary using the Llama 3 model.
3. **Animation**: The frontend receives the response and plays a word-by-word typewriter animation.
4. **Caching**: To save your AI quota, the summary is cached in the user's `localStorage`.
