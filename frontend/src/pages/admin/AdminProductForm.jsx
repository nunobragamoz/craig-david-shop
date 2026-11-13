import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { imageUrl } from "../../utils/format";

const empty = {
  nome: "",
  descricao: "",
  preco: "",
  stock: "",
  categoria_id: "",
  destaque: false,
  imagem: "",
};

export default function AdminProductForm() {
  const { id } = useParams(); // Nenhum ID significa que é um novo produto, senão é para editar o produto existente
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null); // nova imagem escolhida, ou null se não houver nenhuma
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState([]);

  // Carregar as categorias para o select e, em modo edição, o produto
  useEffect(() => {
    api("categories.php").then(setCategories).catch(() => {});
    if (!isEdit) return;
    api(`admin/products.php?id=${id}`)
      .then((p) =>
        setForm({
          ...p,
          descricao: p.descricao || "",
          destaque: Boolean(Number(p.destaque)),
        }),
      )
      .catch((err) => setServerError(err.message));
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validate() {
    const errs = {};
    if (form.nome.trim().length < 2) errs.nome = "Indique o nome";
    if (!(Number(form.preco) > 0))
      errs.preco = "O preço tem de ser maior que 0";
    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    )
      errs.stock = "Número inteiro, 0 ou mais";
    if (!form.categoria_id) errs.categoria_id = "Escolha uma categoria";
    if (!isEdit && !file) errs.imagem = "Escolha uma imagem";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length > 0) return;

    // FormData = o formato que consegue transportar um ficheiro juntamente com os campos de texto
    const fd = new FormData();
    if (isEdit) fd.append("id", id);
    fd.append("nome", form.nome);
    fd.append("descricao", form.descricao || "");
    fd.append("preco", form.preco);
    fd.append("stock", form.stock);
    fd.append("categoria_id", form.categoria_id);
    fd.append("destaque", form.destaque ? "1" : "0");
    if (file) fd.append("imagem", file);

    try {
      await api("admin/products.php", { method: "POST", body: fd });
      navigate("/admin/produtos");
    } catch (err) {
      setErrors(err.errors);
      setServerError(err.message);
    }
  }

  // Preview da imagem: se houver um ficheiro novo,
  // mostrar a pré-visualização, senão mostrar a imagem existente (se houver)
  const preview = file
    ? URL.createObjectURL(file)
    : form.imagem
      ? imageUrl(form.imagem)
      : null;

  const cls = (name) => `form-control ${errors[name] ? "is-invalid" : ""}`;

  return (
    <>
      <h1 className="h3 mb-4">{isEdit ? "Editar produto" : "Novo produto"}</h1>
      {serverError && <div className="alert alert-danger">{serverError}</div>}
      <form className="card shadow-sm" onSubmit={handleSubmit} noValidate>
        <div className="card-body row g-3">
          <div className="col-md-8">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              className={cls("nome")}
              value={form.nome}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.nome}</div>
          </div>
          <div className="col-md-4">
            <label htmlFor="categoria_id" className="form-label">
              Categoria
            </label>
            <select
              id="categoria_id"
              name="categoria_id"
              className={`form-select ${errors.categoria_id ? "is-invalid" : ""}`}
              value={form.categoria_id}
              onChange={handleChange}
            >
              <option value="">Escolher…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.categoria_id}</div>
          </div>
          <div className="col-12">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows="3"
              className="form-control"
              value={form.descricao}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-sm-4">
            <label htmlFor="preco" className="form-label">
              Preço (€)
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              min="0"
              className={cls("preco")}
              value={form.preco}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.preco}</div>
          </div>
          <div className="col-sm-4">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              className={cls("stock")}
              value={form.stock}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.stock}</div>
          </div>
          <div className="col-sm-4 d-flex align-items-end">
            <div className="form-check form-switch mb-2">
              <input
                id="destaque"
                name="destaque"
                type="checkbox"
                className="form-check-input"
                checked={form.destaque}
                onChange={handleChange}
              />
              <label htmlFor="destaque" className="form-check-label">
                Em destaque na página inicial
              </label>
            </div>
          </div>
          <div className="col-md-8">
            <label htmlFor="imagem" className="form-label">
              Imagem (JPG, PNG ou WEBP, máx. 2 MB)
            </label>
            <input
              id="imagem"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={cls("imagem")}
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            <div className="invalid-feedback">{errors.imagem}</div>
          </div>
          <div className="col-md-4">
            {preview && (
              <img
                src={preview}
                alt="Pré-visualização"
                className="img-thumbnail"
                style={{ maxHeight: "140px" }}
              />
            )}
          </div>
        </div>
        <div className="card-footer d-flex gap-2">
          <button className="btn btn-accent">Guardar</button>
          <Link to="/admin/produtos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
