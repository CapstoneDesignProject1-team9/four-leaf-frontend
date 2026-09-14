import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Docker 컨테이너에서 외부 접근 허용
    port: 3000,
    hmr: {
      port: 3000,      // HMR WebSocket 포트 (Docker 내부와 일치)
    },
    watch: {
      usePolling: true, // Docker volume mount에서 파일 변경 감지
    },
  },
})

