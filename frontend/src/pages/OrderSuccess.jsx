import { Link, useParams } from "react-router-dom";

// Mostrado depois de uma encomenda bem sucedida, com o id da encomenda no URL
export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="container py-5 text-center">
      <i
        className="fa-solid fa-circle-check text-success"
        style={{ fontSize: "4rem" }}
      ></i>
      <h1 className="h2 mt-3">Encomenda #{id} confirmada</h1>
      <p className="text-muted">
        Obrigado pela sua compra! Pode acompanhar o estado na sua conta.
      </p>
      <div className="d-flex justify-content-center gap-2 mt-4">
        <Link to={`/conta/encomendas/${id}`} className="btn btn-accent">
          Ver a encomenda
        </Link>
        <Link to="/loja" className="btn btn-outline-secondary">
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
