import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio oficial. Mantener en sincronía con SITE_URL en src/config.ts.
// Publicar este build solo cuando cecponline.com ya apunte al hosting.
const SITE_URL = 'https://cecponline.com';

export default defineConfig({
  site: SITE_URL,

  /**
   * Tipografías AUTOHOSPEDADAS.
   *
   * Astro las descarga en el build y las sirve desde cecponline.com. Antes se
   * pedían a fonts.googleapis.com + fonts.gstatic.com, lo que costaba dos
   * conexiones a servidores ajenos antes de poder pintar el texto y, sobre todo,
   * enviaba la IP de cada visitante a Google sin que hubiera consentido nada
   * — incoherente con la política de privacidad del sitio (LOPDP).
   *
   * Los pesos son EXACTAMENTE los que se pedían antes: no cambia el aspecto.
   * Subconjunto `latin`: cubre todos los acentos y signos del español (ñ, á, ¿, ¡)
   * y la puntuación que usa el sitio (— y ·).
   */
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--fuente-montserrat',
      weights: [600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--fuente-poppins',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--fuente-inter',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

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
