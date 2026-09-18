// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ai-domain.ai',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [
    sitemap({
      // EN and DE are real pages; hreflang pairs are emitted in the sitemap as well.
      i18n: { defaultLocale: 'en', locales: { en: 'en', de: 'de' } },
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  devToolbar: { enabled: false },
});
