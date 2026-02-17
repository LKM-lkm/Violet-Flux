<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>

<style>
@font-face {
  font-family: 'Geist Sans';
  src: url('/Geist-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: 'Geist Sans';
  src: url('/GeistItalic-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: italic;
  font-display: block;
}

@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('/BricolageGrotesque-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}

:root {
  --bg: #ffffff;
  --text: #0b021a;
  --text-muted: #5d5179;
  --border: rgba(138, 43, 226, 0.15);
  --primary: #8b5cf6;
  --primary-glow: rgba(139, 92, 246, 0.4);
  --secondary: #f5f3ff;
  --accent: #a78bfa;
}

:root.dark {
  --bg: #030005;
  --text: #f3f0ff;
  --text-muted: #a78bfa;
  --border: rgba(167, 139, 250, 0.2);
  --primary: #c084fc;
  --primary-glow: rgba(192, 132, 252, 0.5);
  --secondary: #0f0a1a;
  --accent: #e9d5ff;
}

body {
  font-family: 'Geist Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  margin: 0;
  transition: background 0.3s, color 0.3s;
}
</style>