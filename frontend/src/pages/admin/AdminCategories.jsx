import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { categories as fakeCategories, products } from "../../data/fakeData";

export default function AdminCategories() {
  // Fake : useState em vez de useEffect + fetch, porque ainda não temos backend
  const [categories, setCategories] = useState(
    fakeCategories.map((c) => ({
      ...c,
      produtos: products.filter((p) => p.categoria_id === c.id).length,
    })),
  );
  const [nome, setNome] = useState("");
  const [editingId, setEditingId] = useState(null); // null = não estamos a editar nenhuma categoria, senão é o id da categoria que estamos a editar
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (nome.trim().length < 2) return setError("Indique o nome da categoria");
    // Fake : depois virá da API, com POST ou PUT
    if (editingId) {
      setCategories(
        categories.map((c) =>
          c.id === editingId ? { ...c, nome: nome.trim() } : c,
        ),
      );
    } else {
      setCategories([
        ...categories,
        { id: Date.now(), nome: nome.trim(), produtos: 0 },
      ]);
    }
    setNome("");
    setEditingId(null);
    setError("");
  }

  function startEdit(c) {
    setEditingId(c.id);
    setNome(c.nome);
    setError("");
  }

  function confirmDelete() {
    if (toDelete.produtos > 0) {
      setError("Não pode apagar uma categoria que ainda tem produtos.");
    } else {
      setCategories(categories.filter((c) => c.id !== toDelete.id)); // Fake
    }
    setToDelete(null);
  }

  return (
    <>
      <h1 className="h3 mb-4">Categorias</h1>
      <form className="d-flex gap-2 mb-2" onSubmit={handleSubmit}>
        <input
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-label="Nome da categoria"
        />
        <button className="btn btn-accent text-nowrap">
          {editingId ? "Guardar" : "Adicionar"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setEditingId(null);
              setNome("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {error && <div className="text-danger small mb-3">{error}</div>}
      <div className="card shadow-sm mt-3">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Produtos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.produtos}</td>
                <td className="text-end text-nowrap">
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => startEdit(c)}
                    aria-label={`Editar ${c.nome}`}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setToDelete(c)}
                    aria-label={`Apagar ${c.nome}`}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        show={Boolean(toDelete)}
        title="Apagar categoria"
        message={`Apagar "${toDelete?.nome}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
