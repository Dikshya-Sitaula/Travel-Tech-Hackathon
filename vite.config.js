import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const yatraxApiPlugin = () => ({
  name: 'yatrax-local-api',
  configureServer(server) {
    server.middlewares.use('/api/itinerary', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/geminiItinerary.js')).href;
      const { handleGeminiItinerary } = await import(/* @vite-ignore */ handlerUrl);
      await handleGeminiItinerary(request, response);
    });
    server.middlewares.use('/api/gemini', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/geminiAssistant.js')).href;
      const { handleGeminiAssistant } = await import(/* @vite-ignore */ handlerUrl);
      await handleGeminiAssistant(request, response);
    });
    server.middlewares.use('/api/landmark', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/geminiLandmark.js')).href;
      const { handleGeminiLandmark } = await import(/* @vite-ignore */ handlerUrl);
      await handleGeminiLandmark(request, response);
    });
    server.middlewares.use('/api/sos', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/sosLog.js')).href;
      const { handleSOSLog } = await import(/* @vite-ignore */ handlerUrl);
      await handleSOSLog(request, response);
    });
    server.middlewares.use('/api/emergency/gateway', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/sosLog.js')).href;
      const { handleSOSGateway } = await import(/* @vite-ignore */ handlerUrl);
      await handleSOSGateway(request, response);
    });
    server.middlewares.use('/api/usage', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/usageAnalytics.js')).href;
      const { handleUsage } = await import(/* @vite-ignore */ handlerUrl);
      await handleUsage(request, response);
    });
    server.middlewares.use('/api/revenue', async (request, response) => {
      const handlerUrl = pathToFileURL(resolve(process.cwd(), 'server/usageAnalytics.js')).href;
      const { handleRevenue } = await import(/* @vite-ignore */ handlerUrl);
      await handleRevenue(request, response);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), yatraxApiPlugin()],
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      proxy: {
        '/ollama': {
          target: 'http://127.0.0.1:11434',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ollama/, ''),
        },
      },
    },
  };
})
