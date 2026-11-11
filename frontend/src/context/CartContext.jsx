import { useEffect, useState } from "react";
import { CartContext, FREE_SHIPPING_FROM, SHIPPING_COST } from "./cart-context";

const STORAGE_KEY = "cd_shop_cart";

// Le o cart uma vez quando inicia
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // sempre que os items mudarem salva para sobreviver ao refresh
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // O State nunca e mudado diretamente
  function addToCart(product, quantidade = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantidade: Math.min(i.quantidade + quantidade, i.stock) }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          nome: product.nome,
          preco: Number(product.preco),
          imagem: product.imagem,
          stock: product.stock,
          quantidade: Math.min(quantidade, product.stock),
        },
      ];
    });
  }

  // Mantem a quantidade ente 1 e o stock
  function updateQuantity(id, quantidade) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantidade: Math.max(1, Math.min(quantidade, i.stock)) }
          : i,
      ),
    );
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  // Values derivados, nunca guardados
  const itemCount = items.reduce((sum, i) => sum + i.quantidade, 0);
  const subtotal = items.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
  const portes =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const total = subtotal + portes;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        portes,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
