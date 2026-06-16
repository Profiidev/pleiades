import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), svelteTesting()],
  resolve: process.env.VITEST
    ? {
        conditions: ['browser']
      }
    : undefined,
  test: {
    clearMocks: true,
    environment: 'jsdom',
    include: ['src/tests/unit/**/*.{test,spec}.{js,ts}'],
    setupFiles: [
      './src/tests/setup/vitest-setup.ts',
      './src/tests/setup/vitest-setup-sveltekit.ts'
    ]
  }
});
