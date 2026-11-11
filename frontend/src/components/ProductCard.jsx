import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { formatPrice, imageUrl } from "../utils/format";

// Um Card re-utilizavel. Recebe um produto atraves de props e pode adicionar ao carrinho
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false); // mostra "Adicionado!" por um momento

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="card h-100 shadow-sm product-card">
      <Link to={`/produto/${product.id}`}>
        <img
          src={imageUrl(product.imagem)}
          className="card-img-top"
          alt={product.nome}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">
          {product.categoria}
        </span>
        <h3 className="h6 card-title">
          <Link
            to={`/produto/${product.id}`}
            className="text-reset text-decoration-none"
          >
            {product.nome}
          </Link>
        </h3>
        <p className="fw-bold text-accent mb-3">{formatPrice(product.preco)}</p>
        <button
          className={`btn mt-auto ${added ? "btn-success" : "btn-accent"}`}
          disabled={product.stock === 0}
          onClick={handleAdd}
        >
          <i
            className={`fa-solid ${added ? "fa-check" : "fa-cart-plus"} me-2`}
          ></i>
          {product.stock === 0
            ? "Esgotado"
            : added
              ? "Adicionado!"
              : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
