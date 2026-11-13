// Caixa de Confirmação em Bootstrap, que o React mostra e esconde.

// Janela de confirmação reutilizável (ex.: antes de apagar); a página-mãe decide se aparece.
export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!show) return null;
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                Apagar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
