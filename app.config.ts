export default defineAppConfig({
  ui: {
    // 配置 Prose 组件样式
    prose: {
      // Callout 组件配置
      callout: {
        slots: {
          base: 'my-5 p-4 rounded-lg border',
          icon: 'inline-block mr-2',
        },
        variants: {
          color: {
            info: {
              base: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
              icon: 'text-blue-600 dark:text-blue-400',
            },
            success: {
              base: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
              icon: 'text-green-600 dark:text-green-400',
            },
            warning: {
              base: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
              icon: 'text-orange-600 dark:text-orange-400',
            },
            error: {
              base: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
              icon: 'text-red-600 dark:text-red-400',
            },
            primary: {
              base: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
              icon: 'text-purple-600 dark:text-purple-400',
            },
            neutral: {
              base: 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800',
              icon: 'text-gray-600 dark:text-gray-400',
            },
          },
        },
      },
      
      // 其他 Prose 组件配置
      h1: {
        slots: {
          base: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4',
        },
      },
      h2: {
        slots: {
          base: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4',
        },
      },
      h3: {
        slots: {
          base: 'scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4',
        },
      },
      p: {
        slots: {
          base: 'leading-7 [&:not(:first-child)]:mt-6',
        },
      },
      code: {
        slots: {
          base: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        },
      },
      pre: {
        slots: {
          base: 'mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4',
        },
      },
    },
  },
})
