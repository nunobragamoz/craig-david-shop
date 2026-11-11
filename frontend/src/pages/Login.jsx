import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { isEmail } from "../utils/validation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // Uma mensagem por campo, se houver erro
  const [serverError, setServerError] = useState(""); // mensagem de erro do servidor, se houver
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // remembers the page that sent us to login

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!isEmail(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "Indique a password";
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      const user = await login(form.email, form.password);
      // Admins go to the admin area; customers go back to where they were
      if (user.tipo_utilizador === "admin") navigate("/admin");
      else navigate(location.state?.from || "/");
    } catch (err) {
      setErrors(err.errors);
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Entrar</h1>
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
                <button className="btn btn-accent w-100" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      A entrar…
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </form>
              <p className="text-center mt-3 mb-0 small">
                Ainda não tem conta? <Link to="/registo">Criar conta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
