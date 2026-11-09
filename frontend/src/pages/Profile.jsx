import { useState } from "react";
import AccountMenu from "../components/AccountMenu";
import { currentUser } from "../data/fakeData"; // Fake
import { isEmail, isPhone, isPostalCode } from "../utils/validation";

export default function Profile() {
  // Formulario de detalhes pessoais
  const [form, setForm] = useState({
    nome: currentUser.nome,
    email: currentUser.email,
    telefone: currentUser.telefone,
    morada: currentUser.morada,
    cidade: currentUser.cidade,
    codigo_postal: currentUser.codigo_postal,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Formulario de Password (Por isso mudando detalhes nao afecta a password)
  const [pw, setPw] = useState({
    password_atual: "",
    nova_password: "",
    confirmar: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMessage, setPwMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (form.nome.trim().length < 2) errs.nome = "Indique o nome";
    if (!isEmail(form.email)) errs.email = "Email inválido";
    if (form.telefone && !isPhone(form.telefone))
      errs.telefone = "Telefone com 9 dígitos";
    if (form.codigo_postal && !isPostalCode(form.codigo_postal))
      errs.codigo_postal = "Formato 0000-000";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setMessage("Dados atualizados."); // Fake: grava atraves de profile.php
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!pw.password_atual) errs.password_atual = "Indique a password atual";
    if (pw.nova_password.length < 8) errs.nova_password = "Mínimo 8 caracteres";
    if (pw.confirmar !== pw.nova_password)
      errs.confirmar = "As passwords não coincidem";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setPwMessage("Password alterada."); // Fake
    setPw({ password_atual: "", nova_password: "", confirmar: "" });
  }

  const field = (name, label, props = {}) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={form[name] || ""}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        {...props}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );

  const pwField = (name, label) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="password"
        value={pw[name]}
        className={`form-control ${pwErrors[name] ? "is-invalid" : ""}`}
        onChange={(e) => setPw({ ...pw, [name]: e.target.value })}
      />
      <div className="invalid-feedback">{pwErrors[name]}</div>
    </div>
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">A minha conta</h1>
      <div className="row g-4">
        <div className="col-lg-3">
          <AccountMenu />
        </div>
        <div className="col-lg-9">
          <form
            className="card shadow-sm mb-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="card-body">
              <h2 className="h5 mb-3">Dados pessoais</h2>
              {message && <div className="alert alert-success">{message}</div>}
              <div className="row">
                <div className="col-md-6">{field("nome", "Nome")}</div>
                <div className="col-md-6">
                  {field("email", "Email", { type: "email" })}
                </div>
                <div className="col-md-6">{field("telefone", "Telefone")}</div>
                <div className="col-md-6">{field("morada", "Morada")}</div>
                <div className="col-md-6">
                  {field("codigo_postal", "Código postal", {
                    placeholder: "1000-100",
                  })}
                </div>
                <div className="col-md-6">{field("cidade", "Cidade")}</div>
              </div>
              <button className="btn btn-accent">Guardar alterações</button>
            </div>
          </form>

          <form
            className="card shadow-sm"
            onSubmit={handlePasswordSubmit}
            noValidate
          >
            <div className="card-body">
              <h2 className="h5 mb-3">Alterar password</h2>
              {pwMessage && (
                <div className="alert alert-success">{pwMessage}</div>
              )}
              <div className="row">
                <div className="col-md-4">
                  {pwField("password_atual", "Password atual")}
                </div>
                <div className="col-md-4">
                  {pwField("nova_password", "Nova password")}
                </div>
                <div className="col-md-4">
                  {pwField("confirmar", "Confirmar")}
                </div>
              </div>
              <button className="btn btn-outline-secondary">
                Alterar password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
