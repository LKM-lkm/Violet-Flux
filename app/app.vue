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
  --text: #1a0210;
  --text-muted: #6b5161;
  --border: rgba(112, 26, 69, 0.12);
  --primary: #701a45; /* Darker, redder violet (Wine/Plum) */
  --primary-glow: rgba(112, 26, 69, 0.2);
  --secondary: #fff5f8;
  --accent: #9d174d;
  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(112, 26, 69, 0.15);
  --card-shadow: 0 20px 50px -12px rgba(112, 26, 69, 0.15);
}

:root.dark {
  --bg: #0d0a0c; /* Toned midnight plum, not pure black */
  --text: #fce7f3; /* Softer lavender-white */
  --text-muted: #a27b91; /* Sophisticated muted plum */
  --border: rgba(162, 28, 175, 0.2);
  --primary: #9d174d; /* Consistent wine tone */
  --primary-glow: rgba(157, 23, 77, 0.3);
  --secondary: #1a1418;
  --accent: #d946ef;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);
  --card-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
}

/* Global glassmorphism utility */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--card-shadow);
  border-radius: 1.2rem;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Geist Sans', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.4s ease, color 0.4s ease;
  line-height: 1.6;
}

/* Fix for blurry fonts in some browsers */
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

/* Global fallbacks for code blocks */
pre {
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 1.5rem;
  margin: 2rem 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.9rem;
}

code {
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}
</style>