import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuantitySelector from "../components/QuantitySelector";
import { products } from "../data/fakeData"; // Fake
import { formatPrice, imageUrl } from "../utils/format";

function StockBadge({ stock }) {
  if (stock === 0) return <span className="badge bg-danger">Esgotado</span>;
  if (stock < 5)
    return <span className="badge bg-warning text-dark">Últimas unidades</span>;
  return <span className="badge bg-success">Em stock</span>;
}

export default function ProductDetail() {
  const { id } = useParams(); // id que faz parte do URL
  const [quantidade, setQuantidade] = useState(1);

  // Fake: Depois estas linhas virao da API
  const product = products.find((p) => p.id === Number(id));
  const related = product
    ? products
        .filter(
          (p) => p.categoria_id === product.categoria_id && p.id !== product.id,
        )
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3">Produto não encontrado</h1>
        <Link to="/loja" className="btn btn-accent mt-3">
          Voltar à loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Início</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/loja?categoria=${product.categoria_id}`}>
              {product.categoria}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.nome}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <img
            src={imageUrl(product.imagem)}
            alt={product.nome}
            className="img-fluid rounded shadow-sm w-100"
          />
        </div>
        <div className="col-md-6">
          <h1 className="h2">{product.nome}</h1>
          <p className="fs-3 fw-bold text-accent">
            {formatPrice(product.preco)}
          </p>
          <StockBadge stock={product.stock} />
          <p className="mt-3">{product.descricao}</p>
          {product.stock > 0 && (
            <div className="d-flex flex-wrap gap-3 align-items-center mt-4">
              <QuantitySelector
                value={quantidade}
                max={product.stock}
                onChange={setQuantidade}
              />
              {/* Fake: o botao fara add to the cart */}
              <button className="btn btn-accent btn-lg">
                <i className="fa-solid fa-cart-plus me-2"></i>Adicionar ao
                carrinho
              </button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-5">
          <h2 className="h4 mb-4">Também vai gostar</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {related.map((p) => (
              <div className="col" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
