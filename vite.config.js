import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default {
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: 'https://172.20.100.100:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    },
  },
}