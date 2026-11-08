// Re-utilizavel: A pagina mae manda no value; Apenas relata mudancas
export default function QuantitySelector({ value, max, onChange }) {
  return (
    <div className="input-group" style={{ width: "130px" }}>
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Diminuir"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        −
      </button>
      <input
        type="text"
        className="form-control text-center"
        value={value}
        readOnly
        aria-label="Quantidade"
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Aumentar"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
