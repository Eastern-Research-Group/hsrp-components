import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  return {
    build: {
      // Setting code split to false for now until https://github.com/vitejs/vite/issues/3924 is fixed
      cssCodeSplit: false,
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'hsrp-components',
        fileName: 'hsrp-components',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['vue'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: 'Vue',
          },
          inlineDynamicImports: true,
        },
      },
    },
    plugins: [createVuePlugin(), splitVendorChunkPlugin(), visualizer()],
    resolve: {
      alias: [
        {
          find: '~',
          replacement: path.resolve(__dirname, 'node_modules'),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
  };
});
