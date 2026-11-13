// Cores Boostrap para cada status do pedido
const colors = {
  pendente: "warning text-dark",
  "em processamento": "info text-dark",
  enviada: "primary",
  entregue: "success",
  cancelada: "danger",
};

// Etiqueta colorida com o estado de uma encomenda (pendente, enviada, etc.).
export default function StatusBadge({ estado }) {
  return (
    <span
      className={`badge bg-${colors[estado] || "secondary"} text-capitalize`}
    >
      {estado}
    </span>
  );
}
