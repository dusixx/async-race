import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    assetsDir: '',
    minify: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/styles/sass/utils.scss" as *;
        `,
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
