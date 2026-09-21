import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// GitHub Pages serves the repo at /<repo-name>/, so the build needs that
// base path; local dev and tests run at the root.
const base = process.env.GITHUB_PAGES === 'true' ? '/SanMeyster/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
})
