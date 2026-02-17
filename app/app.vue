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
  --primary-glow: rgba(112, 26, 69, 0.3);
  --secondary: #fff5f8;
  --accent: #9d174d;
}

:root.dark {
  --bg: #050002;
  --text: #fff0f5;
  --text-muted: #d946ef;
  --border: rgba(217, 70, 239, 0.15);
  --primary: #a21caf; /* Redder fuchsia for dark mode */
  --primary-glow: rgba(162, 28, 175, 0.4);
  --secondary: #120108;
  --accent: #f0abfc;
}

body {
  font-family: 'Geist Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  margin: 0;
  transition: background 0.3s, color 0.3s;
}
</style>