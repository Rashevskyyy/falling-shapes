import { defineConfig } from 'vite';

export default defineConfig({
  // relative paths, so the build works from any folder (e.g. GitHub Pages)
  base: './',
  server: {
    // to open the dev server from a phone in the same network
    host: true,
  },
});
