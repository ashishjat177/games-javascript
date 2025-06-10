// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        snake: resolve(__dirname, 'src/snakeAndLadder/index.html'),
        book: resolve(__dirname, 'src/bookmyshow/index.html'),
      }
    }
  },
  server: {
    open: '/index.html',
    port: 3000
  }
});
