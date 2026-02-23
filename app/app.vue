<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>

<style>
@import './assets/design-system.css';

@font-face {
  font-family: 'Geist Sans';
  src: url('/Geist-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Sans';
  src: url('/GeistItalic-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('/BricolageGrotesque-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* 代码块样式 */
pre {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
}

code {
  font-family: var(--font-mono);
}

/* 选中文本样式 */
::selection {
  background: var(--primary-light);
  color: var(--text-primary);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>