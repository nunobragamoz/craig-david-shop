import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import Loader from '../../components/Loader'
import { api } from '../../services/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [editingId, setEditingId] = useState(null)   // null = a criar, um número = a renomear
  const [error, setError] = useState('')
  const [toDelete, setToDelete] = useState(null)

  function load() {
    api('admin/categories.php')
      .then(setCategories)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (nome.trim().length < 2) return setError('Indique o nome da categoria')
    try {
      await api('admin/categories.php', { method: 'POST', body: { id: editingId, nome: nome.trim() } })
      setNome(''); setEditingId(null); setError('')
      load()   // recarregar a lista com as contagens atualizadas
    } catch (err) {
      setError(err.message)   // ex.: "Essa categoria já existe"
    }
  }

  function startEdit(c) { setEditingId(c.id); setNome(c.nome); setError('') }

  async function confirmDelete() {
    try {
      await api(`admin/categories.php?id=${toDelete.id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setError(err.message)   // "Mova ou apague primeiro os produtos…"
    }
    setToDelete(null)
  }

  if (loading) return <Loader />

  return (
    <>
      <h1 className="h3 mb-4">Categorias</h1>
      <form className="d-flex gap-2 mb-2" onSubmit={handleSubmit}>
        <input className={`form-control ${error ? 'is-invalid' : ''}`} placeholder="Nome da categoria"
               value={nome} onChange={e => setNome(e.target.value)} aria-label="Nome da categoria" />
        <button className="btn btn-accent text-nowrap">{editingId ? 'Guardar' : 'Adicionar'}</button>
        {editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setNome('') }}>Cancelar</button>}
      </form>
      {error && <div className="text-danger small mb-3">{error}</div>}
      <div className="card shadow-sm mt-3">
        <table className="table align-middle mb-0">
          <thead><tr><th>Nome</th><th>Produtos</th><th></th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.produtos}</td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => startEdit(c)} aria-label={`Editar ${c.nome}`}><i className="fa-solid fa-pen"></i></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(c)} aria-label={`Apagar ${c.nome}`}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal show={Boolean(toDelete)} title="Apagar categoria"
                    message={`Apagar "${toDelete?.nome}"?`} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </>
  )
}
