import { useState } from "react";
import { users } from "../../data/fakeData"; // Fake
import { formatDate, formatPrice } from "../../utils/format";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const term = search.toLowerCase();
  const visible = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term),
  );

  return (
    <>
      <h1 className="h3 mb-4">Utilizadores</h1>
      <input
        className="form-control mb-3"
        placeholder="Pesquisar por nome ou email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Pesquisar utilizadores"
      />
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Encomendas</th>
                <th>Total gasto</th>
                <th>Registado em</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${u.tipo_utilizador === "admin" ? "bg-dark" : "bg-secondary"}`}
                    >
                      {u.tipo_utilizador}
                    </span>
                  </td>
                  <td>{u.encomendas}</td>
                  <td>{formatPrice(u.total_gasto)}</td>
                  <td>{formatDate(u.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
