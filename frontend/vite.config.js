import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //O app vive no app tanto em desenvolvimento como em produção, por isso o base é /
  base: "/craig-david-shop/app/",
  build: {
    outDir: "../app", //o npm run build vai criar a pasta app na raiz do projeto, que é o que o servidor vai servir
    emptyOutDir: true,
  },
  server: {
    // Encaminha as requisições para a API para o backend no Apache (XAMPP), mesma origem, e sessões PHP funcionam.
    proxy: {
      "/craig-david-shop/api": "http://localhost",
      "/craig-david-shop/uploads": "http://localhost",
    },
  },
});
