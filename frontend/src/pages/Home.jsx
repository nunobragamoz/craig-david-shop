import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import usePageTitle from "../utils/usePageTitle";
import { api } from "../services/api";

// Icone para cada ID de Categoria. Visivel nos Cart'oes de Categoria
const categoryIcons = {
  1: "fa-compact-disc",
  2: "fa-record-vinyl",
  3: "fa-shirt",
  4: "fa-bag-shopping",
};

// Fundo Hero, ficheiro em frontend/public/img
const heroStyle = {
  backgroundImage: `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${import.meta.env.BASE_URL}img/hero.jpeg)`,
};

// Página inicial: hero, produtos em destaque e atalhos para as categorias.
export default function Home() {
  usePageTitle();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carrega os produtos e categoria quando a pagina abre
  useEffect(() => {
    Promise.all([api("products.php?destaque=1"), api("categories.php")])
      .then(([produtos, cats]) => {
        setFeatured(produtos);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="hero-section d-flex align-items-center text-white text-center"
        style={heroStyle}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">Loja Oficial Craig David</h1>
          <p className="lead mb-4">Álbuns, vinil e merchandising oficial.</p>
          <Link to="/loja" className="btn btn-accent btn-lg me-2">
            Ver Loja
          </Link>
          <a href="#destaques" className="btn btn-outline-light btn-lg">
            Novidades
          </a>
        </div>
      </section>

      <section id="destaques" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Em destaque</h2>
          {loading && <Loader />}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {featured.map((p) => (
              <div className="col" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorias</h2>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {categories.map((c) => (
              <div className="col" key={c.id}>
                <Link
                  to={`/loja?categoria=${c.id}`}
                  className="card h-100 text-center text-decoration-none shadow-sm product-card"
                >
                  <div className="card-body py-4">
                    <i
                      className={`fa-solid ${categoryIcons[c.id] || "fa-tag"} fs-2 text-accent mb-2`}
                    ></i>
                    <h3 className="h6 mb-0">{c.nome}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <i className="fa-solid fa-truck fs-2 text-accent mb-2"></i>
              <h3 className="h6">Portes grátis</h3>
              <p className="text-muted small mb-0">
                Em encomendas acima de 50 €
              </p>
            </div>
            <div className="col-md-4">
              <i className="fa-solid fa-lock fs-2 text-accent mb-2"></i>
              <h3 className="h6">Pagamento seguro</h3>
              <p className="text-muted small mb-0">
                MB Way, Multibanco ou na entrega
              </p>
            </div>
            <div className="col-md-4">
              <i className="fa-solid fa-rotate-left fs-2 text-accent mb-2"></i>
              <h3 className="h6">Devoluções em 14 dias</h3>
              <p className="text-muted small mb-0">Sem complicações</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
