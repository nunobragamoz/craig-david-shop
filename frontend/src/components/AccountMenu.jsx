import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Menu lateral da area de cliente, (NavLink adiciona a classe "active" para a corrente pagina)
export default function AccountMenu() {
    const { logout } = useAuth()
    const navigate = useNavigate()
  return (
    <div className="list-group mb-4">
      <NavLink
        to="/conta"
        end
        className="list-group-item list-group-item-action"
      >
        <i className="fa-solid fa-user me-2"></i>Perfil
      </NavLink>
      <NavLink
        to="/conta/encomendas"
        className="list-group-item list-group-item-action"
      >
        <i className="fa-solid fa-receipt me-2"></i>Encomendas
      </NavLink>

      <button className="list-group-item list-group-item-action text-danger" onClick={async () => { await logout(); navigate('/') }}>
        <i className="fa-solid fa-right-from-bracket me-2"></i>Sair
      </button>
    </div>
  );
}
