import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// you can copy the base structure of manifest object.
const manifestForPlugIn = {
  registerType:'prompt',
  includeAssests:['favicon.ico', "apple-touc-icon.png", "maskable_icon.png"],
  manifest:{
    name:"Tiempo de Handball - Tu contador de confianza",
    short_name:"Tiempo de Handball",
    description:"que la division de gastos, no sea un problema 📈💰📊.",
    icons:[{
      src: '/android-chrome-192x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'/android-chrome-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes:'180x180',
      type:'image/png',
      purpose:'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes:'320x320',
      type:'image/png',
      purpose:'any maskable',
    }
  ],
  theme_color:'#4b5563',
  background_color:'#4b5563',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  build: {
    assetsDir: 'assets/images'
    // Configura otros aspectos del build si es necesario
  }
})

