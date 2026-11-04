// Pequenos ajudantes usado por varios componentes

// Formata o preço para o formato de moeda local
export const formatPrice = (value) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(
    Number(value),
  );

// Formata a data para o formato local
export const formatDate = (value) =>
  new Date(String(value).replace(" ", "T")).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Nome de Ficheiro guardado na base de dados servido pelo Apache
export const imageUrl = (filename) =>
  `/craig-david-shop/uploads/products/${filename}`;
