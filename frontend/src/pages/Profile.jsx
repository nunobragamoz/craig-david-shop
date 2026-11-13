import { useEffect, useState } from "react";
import AccountMenu from "../components/AccountMenu";
import Loader from "../components/Loader";
import { useAuth } from "../context/auth-context";
import usePageTitle from "../utils/usePageTitle";
import { api } from "../services/api";
import { isEmail, isPhone, isPostalCode } from "../utils/validation";

const emptyPw = { password_atual: "", nova_password: "", confirmar: "" };

// Perfil do cliente: editar dados pessoais e mudar a password.
export default function Profile() {
  usePageTitle("A minha conta");
  const { setUser } = useAuth();

  // Dados pessoais
  const [form, setForm] = useState(null); // null até a API responder
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  // Password (formulário separado)
  const [pw, setPw] = useState(emptyPw);
  const [pwErrors, setPwErrors] = useState({});
  const [pwMessage, setPwMessage] = useState("");
  const [pwServerError, setPwServerError] = useState("");

  useEffect(() => {
    api("profile.php")
      .then((p) =>
        setForm({
          nome: p.nome,
          email: p.email,
          telefone: p.telefone || "",
          morada: p.morada || "",
          cidade: p.cidade || "",
          codigo_postal: p.codigo_postal || "",
        }),
      )
      .catch((err) => setServerError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setServerError("");
    const errs = {};
    if (form.nome.trim().length < 2) errs.nome = "Indique o nome";
    if (!isEmail(form.email)) errs.email = "Email inválido";
    if (form.telefone && !isPhone(form.telefone))
      errs.telefone = "Telefone com 9 dígitos";
    if (form.codigo_postal && !isPostalCode(form.codigo_postal))
      errs.codigo_postal = "Formato 0000-000";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const updated = await api("profile.php", { method: "POST", body: form });
      setUser((u) => ({ ...u, nome: updated.nome, email: updated.email })); // o nome na navbar atualiza
      setMessage("Dados atualizados.");
    } catch (err) {
      setErrors(err.errors);
      setServerError(err.message);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwMessage("");
    setPwServerError("");
    const errs = {};
    if (!pw.password_atual) errs.password_atual = "Indique a password atual";
    if (pw.nova_password.length < 8) errs.nova_password = "Mínimo 8 caracteres";
    if (pw.confirmar !== pw.nova_password)
      errs.confirmar = "As passwords não coincidem";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await api("profile.php", {
        method: "POST",
        body: {
          password_atual: pw.password_atual,
          nova_password: pw.nova_password,
        },
      });
      setPwMessage("Password alterada.");
      setPw(emptyPw);
    } catch (err) {
      setPwErrors(err.errors); // ex.: "Password atual incorreta"
      setPwServerError(err.message);
    }
  }

  const field = (name, label, props = {}) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={form[name]}
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

  if (!form) {
    return (
      <div className="container py-5">
        {serverError ? (
          <div className="alert alert-danger">{serverError}</div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }

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
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
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
              {pwServerError && (
                <div className="alert alert-danger">{pwServerError}</div>
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
