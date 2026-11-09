import { NavLink, Outlet, Link } from "react-router-dom";

// Links do menu lateral da area de administracao

const links = [
  { to: "/admin", label: "Painel", icon: "fa-gauge", end: true },
  { to: "/admin/produtos", label: "Produtos", icon: "fa-box" },
  { to: "/admin/categorias", label: "Categorias", icon: "fa-tags" },
  { to: "/admin/encomendas", label: "Encomendas", icon: "fa-receipt" },
  { to: "/admin/utilizadores", label: "Utilizadores", icon: "fa-users" },
];

// Menu lateral da area de administracao (menu a esquerda e area de conteudo a direita)
export default function AdminLayout() {
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <aside className="admin-sidebar bg-primary-cd text-white p-3">
        <h2 className="h5 mb-4">
          <i className="fa-solid fa-music me-2"></i>Admin
        </h2>
        <nav className="nav flex-md-column gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="nav-link text-white-50"
            >
              <i className={`fa-solid ${l.icon} me-2`}></i>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <hr />
        <Link to="/" className="nav-link text-white-50">
          <i className="fa-solid fa-store me-2"></i>Ver loja
        </Link>
        {/* Fake: faz log out */}
        <button className="nav-link text-white-50 bg-transparent border-0 p-0 mt-2">
          <i className="fa-solid fa-right-from-bracket me-2"></i>Sair
        </button>
      </aside>
      <section className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </section>
    </div>
  );
}
