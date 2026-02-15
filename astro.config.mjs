// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  site: 'https://cybermanhao.github.io/leo-blog/',
  output: 'static',
  integrations: [
    expressiveCode({
      themes: ['dracula', 'github-light'],
      themeCssSelector: (theme) => {
        if (theme.name === 'dracula') return '.dark';
        return ':root:not(.dark)';
      },
    }),
    react(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
