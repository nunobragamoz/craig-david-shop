import { Link } from "react-router-dom";

// Rodapé mostrado em todas páginas públicas.(Adaptado do antigo site)
export default function Footer() {
  return (
    <footer className="py-4 text-white bg-primary-cd mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <h2 className="h5 fw-bold">Craig David</h2>
            <p className="text-white-50">
              Loja oficial: álbuns, vinil e merchandising.
            </p>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <h2 className="h5 fw-bold">Links</h2>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-white-50 text-decoration-none">
                  Loja
                </Link>
              </li>
              <li>
                <Link
                  to="/carrinho"
                  className="text-white-50 text-decoration-none"
                >
                  Carrinho
                </Link>
              </li>
              <li>
                <Link
                  to="/conta"
                  className="text-white-50 text-decoration-none"
                >
                  A minha conta
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <h2 className="h5 fw-bold">Redes sociais</h2>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 fs-4" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="text-white-50 fs-4" aria-label="Spotify">
                <i className="fa-brands fa-spotify"></i>
              </a>
              <a href="#" className="text-white-50 fs-4" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-white-50 small mb-0">
          © 2026 Craig David Shop · Projeto final MasterD
        </p>
      </div>
    </footer>
  );
}
