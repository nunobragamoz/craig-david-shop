import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuantitySelector from "../components/QuantitySelector";
import usePageTitle from "../utils/usePageTitle";
import Loader from "../components/Loader";
import { api } from "../services/api";
import { formatPrice, imageUrl } from "../utils/format";
import { useCart } from "../context/cart-context";

function StockBadge({ stock }) {
  if (stock === 0) return <span className="badge bg-danger">Esgotado</span>;
  if (stock < 5)
    return <span className="badge bg-warning text-dark">Últimas unidades</span>;
  return <span className="badge bg-success">Em stock</span>;
}

export default function ProductDetail() {
  const { id } = useParams(); // id que faz parte do URL
  const [quantidade, setQuantidade] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [tamanho, setTamanho] = useState("M");

  const [product, setProduct] = useState(null);
  usePageTitle(product?.nome);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Corre sempre que muda o ID no URL
  useEffect(() => {
    setLoading(true); // Erro inofensivo
    setQuantidade(1);
    window.scrollTo(0, 0);
    api(`products.php?id=${id}`)
      .then((p) => {
        setProduct(p);
        return api(`products.php?categoria=${p.categoria_id}`);
      })
      .then((list) =>
        setRelated(list.filter((p) => p.id !== Number(id)).slice(0, 4)),
      )
      .catch(() => setProduct(null)) // 404 de PHP "Produto não encontrado"
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

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
              {product.categoria === "Vestuário" && (
                <select
                  className="form-select w-auto"
                  aria-label="Tamanho"
                  value={tamanho}
                  onChange={(e) => setTamanho(e.target.value)}
                >
                  {["S", "M", "L", "XL"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
              <QuantitySelector
                value={quantidade}
                max={product.stock}
                onChange={setQuantidade}
              />
              <button
                className={`btn btn-lg ${added ? "btn-success" : "btn-accent"}`}
                onClick={() => {
                  addToCart(product, quantidade);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
              >
                <i
                  className={`fa-solid ${added ? "fa-check" : "fa-cart-plus"} me-2`}
                ></i>
                {added ? "Adicionado!" : "Adicionar ao carrinho"}
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
