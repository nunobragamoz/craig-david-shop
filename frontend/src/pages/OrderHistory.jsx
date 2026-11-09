import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import StatusBadge from "../components/StatusBadge";
import { orders } from "../data/fakeData"; // Fake
import { formatDate, formatPrice } from "../utils/format";

export default function OrderHistory() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">A minha conta</h1>
      <div className="row g-4">
        <div className="col-lg-3">
          <AccountMenu />
        </div>
        <div className="col-lg-9">
          <h2 className="h5 mb-3">As minhas encomendas</h2>
          {orders.length === 0 ? (
            <p className="text-muted">Ainda não fez encomendas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Data</th>
                    <th>Artigos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{formatDate(o.data)}</td>
                      <td>{o.artigos}</td>
                      <td>{formatPrice(o.total)}</td>
                      <td>
                        <StatusBadge estado={o.estado} />
                      </td>
                      <td>
                        <Link
                          to={`/conta/encomendas/${o.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
