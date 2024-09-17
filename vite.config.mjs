import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
// import visualizer from 'rollup-plugin-visualizer';

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
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 3,
            },
          },
        },
      }),
      splitVendorChunkPlugin(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'node_modules'),
        '@': path.resolve(__dirname, 'src'),
        // vue: '@vue/compat',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['./node_modules/@uswds/uswds/packages'],
        },
      },
    },
    optimizeDeps: {
      noDiscovery: true,
    },
  };
});
