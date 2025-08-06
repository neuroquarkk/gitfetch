import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/gitfetch/',
    server: {
        port: 5173,
    },
    build: {
        sourcemap: true,
        emptyOutDir: true,
    },
});
