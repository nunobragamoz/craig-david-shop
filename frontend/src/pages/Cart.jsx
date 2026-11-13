import { Link } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/cart-context";
import { formatPrice, imageUrl } from "../utils/format";
import usePageTitle from "../utils/usePageTitle";

// Carrinho: lista os artigos, permite alterar quantidades/remover e mostra o resumo.
export default function Cart() {
  usePageTitle("Carrinho");
  const { items, updateQuantity, removeFromCart, subtotal, portes, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="fa-solid fa-cart-shopping fs-1 text-muted mb-3"></i>
        <h1 className="h3">O seu carrinho está vazio</h1>
        <Link to="/loja" className="btn btn-accent mt-3">
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Carrinho</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm">
              <div className="card-body d-flex flex-wrap align-items-center gap-3">
                <img
                  src={imageUrl(item.imagem)}
                  alt={item.nome}
                  width="80"
                  height="80"
                  className="rounded object-fit-cover"
                />
                <div className="flex-grow-1">
                  <Link
                    to={`/produto/${item.id}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {item.nome}
                  </Link>
                  <div className="text-muted small">
                    {formatPrice(item.preco)} / unidade
                  </div>
                </div>
                <QuantitySelector
                  value={item.quantidade}
                  max={item.stock}
                  onChange={(q) => updateQuantity(item.id, q)}
                />
                <div className="fw-bold text-end" style={{ minWidth: "80px" }}>
                  {formatPrice(item.preco * item.quantidade)}
                </div>
                <button
                  className="btn btn-link text-danger"
                  aria-label={`Remover ${item.nome}`}
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
          <Link to="/loja" className="text-decoration-none">
            <i className="fa-solid fa-arrow-left me-2"></i>Continuar a comprar
          </Link>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Resumo</h2>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Portes</span>
                <span>{portes === 0 ? "Grátis" : formatPrice(portes)}</span>
              </div>
              {portes > 0 && (
                <p className="small text-muted">
                  Faltam {formatPrice(50 - subtotal)} para portes grátis.
                </p>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="btn btn-accent w-100">
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
