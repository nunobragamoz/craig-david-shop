import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { api } from "../../services/api";
import usePageTitle from "../../utils/usePageTitle";
import { formatDate, formatPrice } from "../../utils/format";

export default function Dashboard() {
  usePageTitle("Admin · Painel");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("admin/stats.php")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <Loader />;

  const cards = [
    {
      label: "Total de vendas",
      value: formatPrice(stats.total_vendas),
      icon: "fa-euro-sign",
    },
    { label: "Encomendas", value: stats.encomendas, icon: "fa-receipt" },
    { label: "Clientes", value: stats.clientes, icon: "fa-users" },
    {
      label: "Produtos com stock baixo",
      value: stats.stock_baixo,
      icon: "fa-triangle-exclamation",
    },
  ];

  return (
    <>
      <h1 className="h3 mb-4">Painel</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        {cards.map((c) => (
          <div className="col" key={c.label}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <i className={`fa-solid ${c.icon} fs-3 text-accent`}></i>
                <div>
                  <div className="small text-muted">{c.label}</div>
                  <div className="fs-4 fw-bold">{c.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">Últimas encomendas</h2>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Nº</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.ultimas.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <Link to={`/admin/encomendas/${o.id}`}>#{o.id}</Link>
                        </td>
                        <td>{o.nome}</td>
                        <td>{formatDate(o.data)}</td>
                        <td>{formatPrice(o.total)}</td>
                        <td>
                          <StatusBadge estado={o.estado} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">Encomendas por estado</h2>
              {stats.por_estado.map((s) => (
                <div
                  key={s.estado}
                  className="d-flex justify-content-between mb-2"
                >
                  <StatusBadge estado={s.estado} />
                  <span className="fw-bold">{s.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">Mais vendidos</h2>
              <ol className="mb-0 ps-3">
                {stats.mais_vendidos.map((p) => (
                  <li key={p.nome_produto} className="mb-1">
                    {p.nome_produto}{" "}
                    <span className="text-muted">({p.vendidos})</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
