// Cloudflare Worker — AI Summary for Violet Flux
// 部署到: vfs.likem.cc.cd
// 替换 Cloudflare Dashboard → Workers → 代码编辑器中的全部内容

// 允许跨域直连的站点。
// 线上博客走同源 /api/ai-summary 代理，由服务端转发，不经过 CORS；
// 这里只影响「代理不可用后直连 Worker」的回退路径。
// 以后如果绑定了自定义域名，把它加到这个数组里。
const ALLOWED_ORIGINS = ["https://violet-flux.pages.dev"];

// Cloudflare Pages 预览部署：<hash>.violet-flux.pages.dev
const PAGES_PREVIEW = /^https:\/\/[a-z0-9-]+\.violet-flux\.pages\.dev$/;
// 本地开发：http://localhost:3000 等
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
    // 允许的源随请求的 Origin 变化，必须声明 Vary 以免被缓存串味
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

      // 必须是字符串：非字符串走 substring 会抛错并变成 500
      if (typeof content !== "string" || !content.trim()) {
        return json({ error: "Missing content" }, 400, request);
      }

      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的博文摘要助手，来自博客Violet Flux，意为紫流、紫罗兰色不断改变的流动，象征着科技与现代感。请用一段约100-150字的中文总结下面这篇文章的核心内容。语气要优雅、精准，符合科技与文学美感与博客的设计理念。直接输出摘要内容，不要有'摘要：'等前缀。严禁直接输出原文或者重复代码。请注意，你不需要强调你来自紫流，只需要自然地总结即可。",
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
