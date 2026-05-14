import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/TeaWay/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        root: resolve(__dirname, 'src/index.html'),
        main: resolve(__dirname, 'src/pages/index.html'),
        catalog: resolve(__dirname, 'src/pages/catalog.html'),
        product: resolve(__dirname, 'src/pages/product.html'),
        cart: resolve(__dirname, 'src/pages/cart.html'),
      },
    },
  },
  server: {
    open: '/pages/index.html',
  },
});
