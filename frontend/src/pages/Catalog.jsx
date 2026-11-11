import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { api } from "../services/api";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get("categoria") || "";
  const pesquisa = searchParams.get("pesquisa") || "";
  const ordem = searchParams.get("ordem") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Categorias: so um load
  useEffect(() => {
    api("categories.php")
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Produtos: Faz load denovo sempre que um filtro no URL muda
  useEffect(() => {
    // Reset da UI antes de cada pedido (padrao de fetch; reset sincrono intencional)
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setLoading(true);
    setError("");
    const query = new URLSearchParams({
      categoria,
      pesquisa,
      ordem,
    }).toString();
    api(`products.php?${query}`)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoria, pesquisa, ordem]);

  // Muda um filtro no URL, mantendo os outros filtros
  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    setSearchParams(next);
  }

  function handleSearch(e) {
    e.preventDefault();
    updateFilter("pesquisa", e.target.elements.pesquisa.value.trim());
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Loja</h1>
      <div className="row g-4">
        <aside className="col-lg-3">
          <h2 className="h6 text-uppercase text-muted">Categorias</h2>
          {/* Desktop: Lista vertical */}
          <div className="list-group d-none d-lg-block">
            <button
              className={`list-group-item list-group-item-action ${!categoria ? "active" : ""}`}
              onClick={() => updateFilter("categoria", "")}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`list-group-item list-group-item-action ${categoria === String(c.id) ? "active" : ""}`}
                onClick={() => updateFilter("categoria", c.id)}
              >
                {c.nome}
              </button>
            ))}
          </div>
          {/* Mobile: pilulas horizontais */}
          <div className="d-flex d-lg-none gap-2 overflow-auto pb-2">
            <button
              className={`btn btn-sm ${!categoria ? "btn-accent" : "btn-outline-secondary"}`}
              onClick={() => updateFilter("categoria", "")}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`btn btn-sm text-nowrap ${categoria === String(c.id) ? "btn-accent" : "btn-outline-secondary"}`}
                onClick={() => updateFilter("categoria", c.id)}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </aside>

        <section className="col-lg-9">
          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center mb-4">
            <form className="d-flex flex-grow-1" onSubmit={handleSearch}>
              <input
                name="pesquisa"
                className="form-control"
                placeholder="Pesquisar produtos…"
                defaultValue={pesquisa}
                key={pesquisa}
                aria-label="Pesquisar produtos"
              />
              <button className="btn btn-accent ms-2" aria-label="Pesquisar">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
            <select
              className="form-select w-auto"
              value={ordem}
              aria-label="Ordenar"
              onChange={(e) => updateFilter("ordem", e.target.value)}
            >
              <option value="">Mais recentes</option>
              <option value="preco_asc">Preço ↑</option>
              <option value="preco_desc">Preço ↓</option>
              <option value="nome">Nome</option>
            </select>
            <span className="text-muted small text-nowrap">
              {loading ? "…" : `${products.length} produtos`}
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-box-open fs-1 text-muted mb-3"></i>
              <p>Nenhum produto encontrado.</p>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchParams({})}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
              {products.map((p) => (
                <div className="col" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
