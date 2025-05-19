import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// Custom plugin to log when build is complete with stats info
const logVisualizerReady = (): Plugin => {
  return {
    name: 'log-visualizer-ready',
    closeBundle() {
      console.log('\x1b[32m%s\x1b[0m', '✓ Build complete! Visualizer report is ready at dist/stats.html');
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/MarkdownEditor/",
  server: {
    allowedHosts: true,
    cors: true,
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    logVisualizerReady(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
