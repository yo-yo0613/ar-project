import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mind,glb,gltf,mp3}'],
        maximumFileSizeToCacheInBytes: 10000000 // 10MB limit
      },
      manifest: {
        name: 'AR Study Buddy',
        short_name: 'StudyBuddy',
        description: 'AR Pomodoro Timer for focused studying',
        theme_color: '#0F172A',
        icons: [
          {
            src: '/companion_happy.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
