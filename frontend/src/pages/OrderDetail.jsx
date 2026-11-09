import { Link, useParams } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import StatusBadge from "../components/StatusBadge";
import { orders, orderItems, currentUser } from "../data/fakeData"; // Fake
import { formatDate, formatPrice, imageUrl } from "../utils/format";

export default function OrderDetail() {
  const { id } = useParams();

  // Fake: uma chamada da API retorna a encomenda com os seus itens e endereço
  const order = orders.find((o) => o.id === Number(id));
  const items = orderItems;
  const envio = {
    nome: currentUser.nome,
    morada: currentUser.morada,
    codigo_postal: currentUser.codigo_postal,
    cidade: currentUser.cidade,
    telefone: currentUser.telefone,
  };

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
              {items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center gap-3"
                >
                  <img
                    src={imageUrl(item.imagem)}
                    alt={item.nome_produto}
                    width="56"
                    height="56"
                    className="rounded object-fit-cover"
                  />
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
                    {envio.nome}
                    <br />
                    {envio.morada}
                    <br />
                    {envio.codigo_postal} {envio.cidade}
                    <br />
                    {envio.telefone}
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
