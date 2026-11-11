import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
import { formatDate, formatPrice, imageUrl } from "../utils/format";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Um pedido devolve a encomenda com os seus artigos e a morada de envio
  useEffect(() => {
    api(`orders.php?id=${id}`)
      .then(setOrder)
      .catch(() => setOrder(null)) // 404: não encontrada ou não é minha
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) {
    return (
      <div className="container py-5">
        <p>Encomenda não encontrada.</p>
        <Link to="/conta/encomendas">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">A minha conta</h1>
      <div className="row g-4">
        <div className="col-lg-3">
          <AccountMenu />
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h2 className="h5 mb-0">
              Encomenda #{order.id} · {formatDate(order.data)}
            </h2>
            <StatusBadge estado={order.estado} />
          </div>
          <div className="card shadow-sm mb-3">
            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center gap-3"
                >
                  {item.imagem && (
                    <img
                      src={imageUrl(item.imagem)}
                      alt={item.nome_produto}
                      width="56"
                      height="56"
                      className="rounded object-fit-cover"
                    />
                  )}
                  <span className="flex-grow-1">
                    {item.quantidade} × {item.nome_produto}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h6">Morada de envio</h3>
                  <p className="mb-0 small">
                    {order.nome_envio}
                    <br />
                    {order.morada_envio}
                    <br />
                    {order.codigo_postal_envio} {order.cidade_envio}
                    <br />
                    {order.telefone_envio}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <span>Portes</span>
                    <span>{formatPrice(order.portes)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/conta/encomendas"
            className="d-inline-block mt-3 text-decoration-none"
          >
            <i className="fa-solid fa-arrow-left me-2"></i>Voltar às encomendas
          </Link>
        </div>
      </div>
    </div>
  );
}
