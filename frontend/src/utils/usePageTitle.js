import { useEffect } from "react";

// Define o título do separador do browser, ex.: usePageTitle('Carrinho') → "Carrinho | Craig David"
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | Craig David`
      : "Craig David | Loja Oficial";
  }, [title]);
}
