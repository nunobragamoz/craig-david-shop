import { useState } from "react";
import { Link } from "react-router-dom";
import { isEmail } from "../utils/validation";

export default function Register() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (form.nome.trim().length < 2) errs.nome = "Indique o seu nome";
    if (!isEmail(form.email)) errs.email = "Email inválido";
    if (form.password.length < 8) errs.password = "Mínimo 8 caracteres";
    if (form.confirmar !== form.password)
      errs.confirmar = "As passwords não coincidem";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // Fake
    setServerError("Registo ainda não ligado ao servidor (Fase 5).");
  }

  // Desenha o input com o label e o erro, se houver
  const field = (name, label, type = "text", hint = "") => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
      />
      {hint && !errors[name] && <div className="form-text">{hint}</div>}
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Criar conta</h1>
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit} noValidate>
                {field("nome", "Nome")}
                {field("email", "Email", "email")}
                {field(
                  "password",
                  "Password",
                  "password",
                  "Mínimo 8 caracteres.",
                )}
                {field("confirmar", "Confirmar password", "password")}
                <button
                  className="btn btn-accent w-100 mt-2"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      A criar…
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </form>
              <p className="text-center mt-3 mb-0 small">
                Já tem conta? <Link to="/login">Entrar</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
