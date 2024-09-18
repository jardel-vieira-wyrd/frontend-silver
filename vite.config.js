import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // Modify this section
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        coverage: {
            provider: 'v8'
        },
        css: true,
    },
});
