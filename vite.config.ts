import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.tsx', '**/*.test.ts', 'src/__tests__/test-setup.ts'],
    }),
  ],
  build: {
    lib: {
      // Two entry points: headless core + prebuilt UI layer
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        prebuilt: resolve(__dirname, 'src/prebuilt.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        preserveModules: true,
      },
    },
    sourcemap: true,
    minify: true,
  },
})
