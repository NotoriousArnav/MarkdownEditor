import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default {
  main: {
    // vite config options
    plugins: [
      externalizeDepsPlugin(),
    ],
  },
  preload: {
    // vite config options
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
    ]
  }
}
