import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue2';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
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
    plugins: [vue(), splitVendorChunkPlugin(), visualizer()],
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
        // Use minified vue build on prod
        {
          find: 'vue',
          replacement: path.resolve(
            __dirname,
            mode === 'prod' ? './node_modules/vue/dist/vue.min.js' : './node_modules/vue'
          ),
        },
      ],
    },
  };
});
