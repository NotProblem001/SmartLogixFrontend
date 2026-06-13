import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'SmartLogixFrontend',
      fileName: (format) => `smartlogixfrontend.${format === 'es' ? 'es' : 'umd'}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Excluir react y react-dom para evitar colisiones del Virtual DOM
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
