import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
