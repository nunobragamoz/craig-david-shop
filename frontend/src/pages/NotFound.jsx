import { Link } from "react-router-dom";

// Qualquer Endereço que não exista, mostra esta página
export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold text-accent">404</h1>
      <p className="lead">Página não encontrada.</p>
      <Link to="/" className="btn btn-accent">
        Voltar ao início
      </Link>
    </div>
  );
}
