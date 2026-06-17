import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const isLib = process.env.BUILD_MODE === 'lib';
  
  const config = {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        thresholds: {
          lines: 60,
          functions: 60,
          branches: 60,
          statements: 60
        }
      }
    }
  };

  if (isLib) {
    config.build = {
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
    };
  }

  return config;
})
