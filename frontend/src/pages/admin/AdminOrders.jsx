import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../services/api'
import { formatDate, formatPrice } from '../../utils/format'

const estados = ['', 'pendente', 'em processamento', 'enviada', 'entregue', 'cancelada']

export default function AdminOrders() {
  const [filtro, setFiltro] = useState('')   // '' = todas
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Recarrega sempre que o separador de filtro muda
  useEffect(() => {
    setLoading(true)
    api(`admin/orders.php?estado=${encodeURIComponent(filtro)}`)
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [filtro])

  return (
    <>
      <h1 className="h3 mb-4">Encomendas</h1>
      <ul className="nav nav-pills mb-3 flex-nowrap overflow-auto">
        {estados.map(e => (
          <li className="nav-item" key={e}>
            <button className={`nav-link text-capitalize text-nowrap ${filtro === e ? 'active' : ''}`} onClick={() => setFiltro(e)}>
              {e || 'Todas'}
            </button>
          </li>
        ))}
      </ul>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <Loader /> : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Nº</th><th>Cliente</th><th>Data</th><th>Total</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.cliente}<div className="small text-muted">{o.email}</div></td>
                    <td>{formatDate(o.data)}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td><StatusBadge estado={o.estado} /></td>
                    <td><Link to={`/admin/encomendas/${o.id}`} className="btn btn-sm btn-outline-secondary">Ver</Link></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">Sem encomendas neste estado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
