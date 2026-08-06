import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio oficial. Mantener en sincronía con SITE_URL en src/config.ts.
// Publicar este build solo cuando cecponline.com ya apunte al hosting.
const SITE_URL = 'https://cecponline.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    sitemap({
      // Fuera del sitemap solo la 404. Las páginas legales SÍ entran: están
      // publicadas y conviene que Google las indexe (son señal de confianza y
      // el aviso de cookies enlaza a /privacidad).
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
