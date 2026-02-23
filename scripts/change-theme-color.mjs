#!/usr/bin/env node

/**
 * 快速更换主题色工具
 * 使用方法: node scripts/change-theme-color.mjs <color-name>
 * 
 * 可用颜色:
 * - rose (默认)
 * - purple
 * - blue
 * - green
 * - orange
 */

import { readFileSync, writeFileSync } from 'fs'

const colorSchemes = {
  'red-violet': {
    name: 'Red Violet (Violet Flux)',
    light: {
      primary: '#c026d3',
      primaryHover: '#a21caf',
      primaryLight: '#fae8ff',
      accent: '#d946ef',
      accentLight: '#f5d0fe',
    },
    dark: {
      primary: '#d946ef',
      primaryHover: '#e879f9',
      primaryLight: '#701a75',
      accent: '#f0abfc',
      accentLight: '#86198f',
    }
  },
  
  rose: {
    name: 'Rose Pink',
    light: {
      primary: '#db2777',
      primaryHover: '#be185d',
      primaryLight: '#fce7f3',
      accent: '#ec4899',
      accentLight: '#fbcfe8',
    },
    dark: {
      primary: '#ec4899',
      primaryHover: '#f472b6',
      primaryLight: '#831843',
      accent: '#f9a8d4',
      accentLight: '#9d174d',
    }
  },
  
  purple: {
    name: 'Purple',
    light: {
      primary: '#9333ea',
      primaryHover: '#7e22ce',
      primaryLight: '#f3e8ff',
      accent: '#a855f7',
      accentLight: '#e9d5ff',
    },
    dark: {
      primary: '#a855f7',
      primaryHover: '#c084fc',
      primaryLight: '#581c87',
      accent: '#d8b4fe',
      accentLight: '#6b21a8',
    }
  },
  
  blue: {
    name: 'Blue',
    light: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primaryLight: '#dbeafe',
      accent: '#3b82f6',
      accentLight: '#bfdbfe',
    },
    dark: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      primaryLight: '#1e3a8a',
      accent: '#93c5fd',
      accentLight: '#1e40af',
    }
  },
  
  green: {
    name: 'Green',
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryLight: '#d1fae5',
      accent: '#10b981',
      accentLight: '#a7f3d0',
    },
    dark: {
      primary: '#10b981',
      primaryHover: '#34d399',
      primaryLight: '#064e3b',
      accent: '#6ee7b7',
      accentLight: '#065f46',
    }
  },
  
  orange: {
    name: 'Orange',
    light: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      primaryLight: '#ffedd5',
      accent: '#f97316',
      accentLight: '#fed7aa',
    },
    dark: {
      primary: '#f97316',
      primaryHover: '#fb923c',
      primaryLight: '#7c2d12',
      accent: '#fdba74',
      accentLight: '#9a3412',
    }
  }
}

const colorName = process.argv[2] || 'red-violet'

if (!colorSchemes[colorName]) {
  console.error(`❌ 未知的颜色方案: ${colorName}`)
  console.log('\n可用的颜色方案:')
  Object.keys(colorSchemes).forEach(key => {
    console.log(`  - ${key}: ${colorSchemes[key].name}`)
  })
  process.exit(1)
}

const scheme = colorSchemes[colorName]
const filePath = 'app/assets/design-system.css'

try {
  let content = readFileSync(filePath, 'utf-8')
  
  // 替换 Light Mode 颜色
  content = content.replace(
    /--primary:\s*#[0-9a-fA-F]{6};/,
    `--primary: ${scheme.light.primary};`
  )
  content = content.replace(
    /--primary-hover:\s*#[0-9a-fA-F]{6};/,
    `--primary-hover: ${scheme.light.primaryHover};`
  )
  content = content.replace(
    /--primary-light:\s*#[0-9a-fA-F]{6};/,
    `--primary-light: ${scheme.light.primaryLight};`
  )
  content = content.replace(
    /--accent:\s*#[0-9a-fA-F]{6};/,
    `--accent: ${scheme.light.accent};`
  )
  content = content.replace(
    /--accent-light:\s*#[0-9a-fA-F]{6};/,
    `--accent-light: ${scheme.light.accentLight};`
  )
  
  // 替换 Dark Mode 颜色
  const darkModeSection = content.match(/:root\.dark\s*\{[^}]+\}/s)
  if (darkModeSection) {
    let darkContent = darkModeSection[0]
    darkContent = darkContent.replace(
      /--primary:\s*#[0-9a-fA-F]{6};/,
      `--primary: ${scheme.dark.primary};`
    )
    darkContent = darkContent.replace(
      /--primary-hover:\s*#[0-9a-fA-F]{6};/,
      `--primary-hover: ${scheme.dark.primaryHover};`
    )
    darkContent = darkContent.replace(
      /--primary-light:\s*#[0-9a-fA-F]{6};/,
      `--primary-light: ${scheme.dark.primaryLight};`
    )
    darkContent = darkContent.replace(
      /--accent:\s*#[0-9a-fA-F]{6};/,
      `--accent: ${scheme.dark.accent};`
    )
    darkContent = darkContent.replace(
      /--accent-light:\s*#[0-9a-fA-F]{6};/,
      `--accent-light: ${scheme.dark.accentLight};`
    )
    content = content.replace(darkModeSection[0], darkContent)
  }
  
  writeFileSync(filePath, content)
  
  console.log(`✅ 主题色已更换为: ${scheme.name}`)
  console.log('\n颜色预览:')
  console.log(`  Light Mode:`)
  console.log(`    主色: ${scheme.light.primary}`)
  console.log(`    强调色: ${scheme.light.accent}`)
  console.log(`  Dark Mode:`)
  console.log(`    主色: ${scheme.dark.primary}`)
  console.log(`    强调色: ${scheme.dark.accent}`)
  console.log('\n💡 刷新浏览器查看效果')
  
} catch (error) {
  console.error('❌ 更换主题色失败:', error.message)
  process.exit(1)
}
