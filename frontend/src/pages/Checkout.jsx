import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { currentUser } from "../data/fakeData";
import { formatPrice } from "../utils/format";
import { isPhone, isPostalCode } from "../utils/validation";

export default function Checkout() {
  const navigate = useNavigate();

  const { items, subtotal, portes, total, clearCart } = useCart();

  // Fake: começa com os dados do perfil do utilizador logado da API
  const [form, setForm] = useState({
    nome: currentUser.nome,
    telefone: currentUser.telefone,
    morada: currentUser.morada,
    codigo_postal: currentUser.codigo_postal,
    cidade: currentUser.cidade,
    pagamento: "mbway",
  });
  const [errors, setErrors] = useState({});

  // Erro do ESLint normal so um aviso porque nada chama ainda
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);

  if (items.length === 0) return <Navigate to="/carrinho" replace />;

  // Um handler para cada input: o nome do input diz qual campo devo actualizar
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Mesmas regras que o PHP vai verificar no backend, mas aqui fazemos uma primeira validação no frontend.
  function validate() {
    const errs = {};
    if (form.nome.trim().length < 2) errs.nome = "Indique o seu nome";
    if (!isPhone(form.telefone))
      errs.telefone = "Nº de Telefone tem de ter 9 dígitos";
    if (form.morada.trim().length < 5) errs.morada = "Indique a sua morada";
    if (!isPostalCode(form.codigo_postal))
      errs.codigo_postal = "Código incorreto. Formato 0000-000";
    if (form.cidade.trim().length < 2) errs.cidade = "Indique a sua cidade";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // FAKE (Phase 8): send the order to orders.php here
    navigate("/encomenda-confirmada/12");
  }

  // Desenha um input com o label e o erro, se houver
  const field = (name, label, props = {}) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        {...props}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">Finalizar compra</h1>
      <form className="row g-4" onSubmit={handleSubmit} noValidate>
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Dados de envio</h2>
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {field("nome", "Nome completo")}
              {field("telefone", "Telefone", {
                inputMode: "numeric",
                placeholder: "912345678",
              })}
              {field("morada", "Morada")}
              <div className="row">
                <div className="col-sm-5">
                  {field("codigo_postal", "Código postal", {
                    placeholder: "1000-100",
                  })}
                </div>
                <div className="col-sm-7">{field("cidade", "Cidade")}</div>
              </div>

              <h2 className="h5 mt-3 mb-3">Pagamento</h2>
              {[
                ["mbway", "MB Way"],
                ["multibanco", "Multibanco"],
                ["entrega", "Pagamento na entrega"],
              ].map(([value, label]) => (
                <div className="form-check" key={value}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="pagamento"
                    id={`pag-${value}`}
                    value={value}
                    checked={form.pagamento === value}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor={`pag-${value}`}>
                    {label}
                  </label>
                </div>
              ))}
              <p className="small text-muted mt-2 mb-0">
                Pagamento simulado para efeitos de demonstração.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">A sua encomenda</h2>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between small mb-2"
                >
                  <span>
                    {item.quantidade} × {item.nome}
                  </span>
                  <span>{formatPrice(item.preco * item.quantidade)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Portes</span>
                <span>{portes === 0 ? "Grátis" : formatPrice(portes)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 my-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-accent w-100"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    A enviar…
                  </>
                ) : (
                  "Confirmar encomenda"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
