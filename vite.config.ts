import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public',
    rollupOptions: {
      input: {
        app: 'src/assets/app.ts',
        styles: 'src/assets/styles.css'
      },
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js'
      }
    }
  }
});