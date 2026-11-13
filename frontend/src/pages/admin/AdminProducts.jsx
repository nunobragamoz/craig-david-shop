import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import Loader from "../../components/Loader";
import { api } from "../../services/api";
import { formatPrice, imageUrl } from "../../utils/format";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("admin/products.php")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null); // Produto a espera de confirmação

  const visible = products.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()),
  );

  async function confirmDelete() {
    try {
      await api(`admin/products.php?id=${toDelete.id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== toDelete.id));
    } catch (err) {
      setError(err.message);
    }
    setToDelete(null);
  }

  if (loading) return <Loader />;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn btn-accent">
          <i className="fa-solid fa-plus me-2"></i>Novo produto
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        className="form-control mb-3"
        placeholder="Pesquisar por nome…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Pesquisar produtos"
      />
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Stock</th>
                <th>Destaque</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={imageUrl(p.imagem)}
                      alt=""
                      width="48"
                      height="48"
                      className="rounded object-fit-cover"
                    />
                  </td>
                  <td>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td>{formatPrice(p.preco)}</td>
                  <td className={p.stock < 5 ? "text-danger fw-bold" : ""}>
                    {p.stock}
                  </td>
                  <td>
                    {Number(p.destaque) ? (
                      <i className="fa-solid fa-star text-warning"></i>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    <Link
                      to={`/admin/produtos/${p.id}/editar`}
                      className="btn btn-sm btn-outline-secondary me-1"
                      aria-label={`Editar ${p.nome}`}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setToDelete(p)}
                      aria-label={`Apagar ${p.nome}`}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        show={Boolean(toDelete)}
        title="Apagar produto"
        message={`Tem a certeza que quer apagar "${toDelete?.nome}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
