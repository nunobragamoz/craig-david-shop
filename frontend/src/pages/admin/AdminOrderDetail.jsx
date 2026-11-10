import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { orders, orderItems, currentUser } from "../../data/fakeData"; // Fake
import { formatDate, formatPrice } from "../../utils/format";

const estados = [
  "pendente",
  "em processamento",
  "enviada",
  "entregue",
  "cancelada",
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  // Fake : uma chamada da API virá buscar a encomenda com o id indicado, e os items da encomenda, e o utilizador que fez a encomenda
  const [order, setOrder] = useState(orders.find((o) => o.id === Number(id)));
  const items = orderItems;
  const envio = currentUser;
  const [novoEstado, setNovoEstado] = useState(order?.estado || "");
  const [message, setMessage] = useState("");

  if (!order)
    return (
      <p>
        Encomenda não encontrada. <Link to="/admin/encomendas">Voltar</Link>
      </p>
    );

  function updateStatus() {
    // Fake: POST { id, estado } para admin/orders.php
    setOrder({ ...order, estado: novoEstado });
    setMessage("Estado atualizado.");
  }

  return (
    <>
      <Link to="/admin/encomendas" className="text-decoration-none">
        <i className="fa-solid fa-arrow-left me-2"></i>Encomendas
      </Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 my-3">
        <h1 className="h3 mb-0">Encomenda #{order.id}</h1>
        <StatusBadge estado={order.estado} />
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd.</th>
                    <th>Preço</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td>{i.nome_produto}</td>
                      <td>{i.quantidade}</td>
                      <td>{formatPrice(i.preco_unitario)}</td>
                      <td>{formatPrice(i.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      Portes
                    </td>
                    <td>{formatPrice(order.portes)}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td colSpan="3" className="text-end">
                      Total
                    </td>
                    <td>{formatPrice(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm mb-3">
            <div className="card-body small">
              <h2 className="h6">Cliente</h2>
              <p className="mb-2">
                {order.cliente}
                <br />
                {order.email}
              </p>
              <h2 className="h6">Envio</h2>
              <p className="mb-0">
                {envio.morada}
                <br />
                {envio.codigo_postal} {envio.cidade}
                <br />
                {envio.telefone}
              </p>
              <p className="text-muted mt-2 mb-0">{formatDate(order.data)}</p>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <label htmlFor="estado" className="form-label">
                Estado
              </label>
              <select
                id="estado"
                className="form-select mb-2 text-capitalize"
                value={novoEstado}
                onChange={(e) => setNovoEstado(e.target.value)}
              >
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-accent w-100"
                onClick={updateStatus}
                disabled={novoEstado === order.estado}
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
