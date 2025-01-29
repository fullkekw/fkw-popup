import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import ip from 'ip';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: `${path.resolve()}/src/_package/index.ts`,
      name: '@fullkekw/fkw-popup',
      fileName: (format) => `index.${format}.js`,
      cssFileName: 'styles'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [react(), dts()],
  server: {
    host: ip.address()
  }
});
