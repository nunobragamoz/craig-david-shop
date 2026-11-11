const API_URL = "/craig-david-shop/api";

// Uso: api('products.php')  |  api('auth/login.php', { method: 'POST', body: { ... } })
// Para upload de ficheiros, usar FormData: api('products.php', { method: 'POST', body: formData })
export async function api(path, { method = "GET", body } = {}) {
  const options = { method, credentials: "include", headers: {} };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}/${path}`, options);
  const data = await res.json().catch(() => ({}));

  // Qualquer status diferente de 2xx torna-se um erro com a mensagem do PHP e os erros de campo
  if (!res.ok) {
    const error = new Error(data.error || "Erro de comunicação com o servidor");
    error.status = res.status;
    error.errors = data.errors || {};
    throw error;
  }
  return data;
}
