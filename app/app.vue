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
  --text: #000000;
  --text-muted: #666666;
  --border: #e5e5e5;
  --primary: #000000;
  --secondary: #f5f5f5;
}

:root.dark {
  --bg: #000000;
  --text: #ffffff;
  --text-muted: #999999;
  --border: #333333;
  --primary: #ffffff;
  --secondary: #1a1a1a;
}

body {
  font-family: 'Geist Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  margin: 0;
  transition: background 0.3s, color 0.3s;
}
</style>