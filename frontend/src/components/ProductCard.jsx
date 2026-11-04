import { Link } from "react-router-dom";
import { formatPrice, imageUrl } from "../utils/format";

// Cartão de Produto re-utilizavel. Receb um produto atraves de props e mostra a informação do produto.
export default function ProductCard({ product }) {
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
        {/* FAKE (Phase 7): the button will add to the cart */}
        <button
          className="btn btn-accent mt-auto"
          disabled={product.stock === 0}
        >
          <i className="fa-solid fa-cart-plus me-2"></i>
          {product.stock === 0 ? "Esgotado" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
