import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: 'blog/**',
        exclude: ['**/.*/**', '**/node_modules/**', '**/.obsidian/**']
      },
      schema: z.object({
        tags: z.array(z.string()).default([]),
        date: z.string().optional(),
        image: z.string().optional(),
      })
    }),
  },
})
