// Spinner centrado enquanto carrega os dados
export default function Loader() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">A carregar…</span>
      </div>
    </div>
  );
}
