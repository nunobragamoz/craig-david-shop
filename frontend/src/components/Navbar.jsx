import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";

// Menu de topo para todas as páginas, com links para a home, loja, carrinho e login/perfil
export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  function handleSearch(e) {
    e.preventDefault();
    const term = e.target.elements.pesquisa.value.trim();
    navigate(term ? `/loja?pesquisa=${encodeURIComponent(term)}` : "/loja");
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary-cd">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fa-solid fa-music me-2"></i>Craig David
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Início
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/loja">
                  Loja
                </NavLink>
              </li>
            </ul>

            <form
              className="d-flex my-2 my-lg-0 me-lg-3"
              role="search"
              onSubmit={handleSearch}
            >
              <input
                name="pesquisa"
                className="form-control form-control-sm"
                type="search"
                placeholder="Pesquisar produtos"
                aria-label="Pesquisar produtos"
              />
            </form>

            <div className="d-flex align-items-center gap-3">
              <Link
                to="/carrinho"
                className="text-white position-relative"
                aria-label="Carrinho"
              >
                <i className="fa-solid fa-cart-shopping fs-5"></i>
                {itemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light btn-sm dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-user me-1"></i>Olá,{" "}
                    {user.nome.split(" ")[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/conta">
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/conta/encomendas">
                        Encomendas
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          Painel admin
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Sair
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-accent btn-sm">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
