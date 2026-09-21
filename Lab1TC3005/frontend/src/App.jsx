import { useEffect, useMemo, useState } from 'react'

const initialAudits = [
  { id: 1, code: 'AUD-2026-014', process: 'Gestión documental', auditor: 'Valentina Ríos', date: '2026-09-18', status: 'En revisión', risk: 'Medio', findings: 'Faltan controles de versión en 2 formatos.' },
  { id: 2, code: 'AUD-2026-013', process: 'Seguridad de la información', auditor: 'Mateo García', date: '2026-09-15', status: 'Cerrada', risk: 'Bajo', findings: 'Evidencia completa y controles operando.' },
  { id: 3, code: 'AUD-2026-012', process: 'Compras y proveedores', auditor: 'Sofía Mendoza', date: '2026-09-11', status: 'Con hallazgos', risk: 'Alto', findings: 'Tres proveedores requieren actualización documental.' },
  { id: 4, code: 'AUD-2026-011', process: 'Recursos humanos', auditor: 'Diego Luna', date: '2026-09-06', status: 'Programada', risk: 'Medio', findings: 'Auditoría prevista para la segunda semana de octubre.' },
  { id: 5, code: 'AUD-2026-010', process: 'Continuidad operativa', auditor: 'Valentina Ríos', date: '2026-08-29', status: 'Cerrada', risk: 'Bajo', findings: 'Plan de continuidad validado en simulacro anual.' },
]

const emptyForm = { process: '', auditor: '', date: '', status: 'Programada', risk: 'Medio', findings: '' }
const statuses = ['Todas', 'Programada', 'En revisión', 'Con hallazgos', 'Cerrada']

function formatDate(date) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function App() {
  const [audits, setAudits] = useState(() => {
    const stored = localStorage.getItem('auditora-audits')
    return stored ? JSON.parse(stored) : initialAudits
  })
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    localStorage.setItem('auditora-audits', JSON.stringify(audits))
  }, [audits])

  const filteredAudits = useMemo(() => audits.filter((audit) => {
    const searchable = `${audit.code} ${audit.process} ${audit.auditor} ${audit.findings}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (statusFilter === 'Todas' || audit.status === statusFilter)
  }), [audits, query, statusFilter])

  const stats = useMemo(() => ({
    total: audits.length,
    active: audits.filter((audit) => audit.status !== 'Cerrada').length,
    findings: audits.filter((audit) => audit.status === 'Con hallazgos').length,
    closed: audits.filter((audit) => audit.status === 'Cerrada').length,
  }), [audits])

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) })
    setIsFormOpen(true)
  }

  function openEditForm(audit) {
    setEditingId(audit.id)
    setForm({ process: audit.process, auditor: audit.auditor, date: audit.date, status: audit.status, risk: audit.risk, findings: audit.findings })
    setIsFormOpen(true)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.process || !form.auditor || !form.date) return

    if (editingId) {
      setAudits((current) => current.map((audit) => audit.id === editingId ? { ...audit, ...form } : audit))
    } else {
      const nextNumber = Math.max(0, ...audits.map((audit) => Number(audit.code.split('-').pop()))) + 1
      setAudits((current) => [{ ...form, id: Date.now(), code: `AUD-2026-${String(nextNumber).padStart(3, '0')}` }, ...current])
    }
    setIsFormOpen(false)
  }

  function deleteAudit(id) {
    if (window.confirm('¿Deseas eliminar esta auditoría?')) setAudits((current) => current.filter((audit) => audit.id !== id))
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>auditora</span></div>
        <div className="workspace-switcher"><span className="workspace-dot" /> Operaciones <span className="chevron">⌄</span></div>
        <nav className="main-nav" aria-label="Navegación principal">
          <a className="nav-item active" href="#auditorias"><span>▦</span> Auditorías</a>
          <a className="nav-item" href="#hallazgos"><span>◈</span> Hallazgos <small>{stats.findings}</small></a>
          <a className="nav-item" href="#calendario"><span>□</span> Calendario</a>
          <a className="nav-item" href="#reportes"><span>⌁</span> Reportes</a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item" href="#configuracion"><span>⚙</span> Configuración</a>
          <div className="user-card"><span className="avatar">SR</span><span><strong>Sam Rojas</strong><small>Administrador</small></span><span className="more">•••</span></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Auditorías</div><div className="top-actions"><button className="icon-button" aria-label="Notificaciones">♧<i /></button><button className="help-button">? <span>Ayuda</span></button></div></header>
        <div className="page-heading"><div><p className="eyebrow">Control interno <span className="live-dot" /> Actualizado hace 4 min</p><h1>Auditorías</h1><p className="subtitle">Supervisa el estado de tus revisiones y mantén cada hallazgo bajo control.</p></div><button className="primary-button" onClick={openCreateForm}><span>＋</span> Nueva auditoría</button></div>

        <section className="stats-grid" aria-label="Resumen de auditorías">
          <article className="stat-card featured"><div className="stat-label">Total de auditorías <span>↗</span></div><strong>{stats.total}</strong><p><b>+12%</b> vs. mes anterior</p><div className="sparkline"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></article>
          <article className="stat-card"><div className="stat-label">En seguimiento <span className="stat-icon amber">◷</span></div><strong>{stats.active}</strong><p>Requieren atención</p></article>
          <article className="stat-card"><div className="stat-label">Con hallazgos <span className="stat-icon coral">!</span></div><strong>{stats.findings}</strong><p>Prioridad alta</p></article>
          <article className="stat-card"><div className="stat-label">Cerradas <span className="stat-icon green">✓</span></div><strong>{stats.closed}</strong><p>Este periodo</p></article>
        </section>

        <section className="table-section" id="auditorias"><div className="table-header"><div><h2>Registro de auditorías</h2><p>{filteredAudits.length} registros encontrados</p></div><div className="table-tools"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar auditoría..." /></label><button className="filter-button" onClick={() => setStatusFilter(statusFilter === 'Todas' ? 'En revisión' : 'Todas')}>☷ <span>Filtrar</span></button><button className="more-button" aria-label="Más opciones">•••</button></div></div><div className="filters-row">{statuses.map((status) => <button key={status} className={statusFilter === status ? 'filter-chip selected' : 'filter-chip'} onClick={() => setStatusFilter(status)}>{status}</button>)}</div>
          <div className="table-wrap"><table><thead><tr><th>Auditoría</th><th>Proceso</th><th>Auditor responsable</th><th>Fecha</th><th>Estado</th><th>Riesgo</th><th aria-label="Acciones" /></tr></thead><tbody>{filteredAudits.map((audit) => <tr key={audit.id}><td><strong className="audit-code">{audit.code}</strong><span className="finding-preview">{audit.findings}</span></td><td>{audit.process}</td><td><span className="person"><span className="mini-avatar">{audit.auditor.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>{audit.auditor}</span></td><td className="date-cell">{formatDate(audit.date)}</td><td><span className={`status ${audit.status.toLowerCase().replace(' ', '-')}`}>{audit.status}</span></td><td><span className={`risk ${audit.risk.toLowerCase()}`}><i />{audit.risk}</span></td><td><div className="row-actions"><button onClick={() => openEditForm(audit)} aria-label={`Editar ${audit.code}`}>✎</button><button onClick={() => deleteAudit(audit.id)} aria-label={`Eliminar ${audit.code}`}>⌫</button></div></td></tr>)}</tbody></table>{filteredAudits.length === 0 && <div className="empty-state"><span>⌕</span><h3>No hay auditorías que coincidan</h3><p>Prueba con otro término o limpia el filtro.</p></div>}</div>
        </section>
        <footer className="footer">Auditora <span>•</span> Control interno simple, claro y accionable <span className="footer-right">v1.0.0</span></footer>
      </section>

      {isFormOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-heading"><div><p className="eyebrow">Registro de control</p><h2 id="form-title">{editingId ? 'Editar auditoría' : 'Nueva auditoría'}</h2></div><button className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Cerrar">×</button></div><form onSubmit={handleSubmit}><label>Proceso<input required value={form.process} onChange={(event) => setForm({ ...form, process: event.target.value })} placeholder="Ej. Gestión documental" /></label><div className="form-row"><label>Auditor responsable<input required value={form.auditor} onChange={(event) => setForm({ ...form, auditor: event.target.value })} placeholder="Nombre completo" /></label><label>Fecha<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label></div><div className="form-row"><label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select></label><label>Nivel de riesgo<select value={form.risk} onChange={(event) => setForm({ ...form, risk: event.target.value })}><option>Bajo</option><option>Medio</option><option>Alto</option></select></label></div><label>Hallazgos y notas<textarea rows="4" value={form.findings} onChange={(event) => setForm({ ...form, findings: event.target.value })} placeholder="Describe el resultado de la auditoría..." /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setIsFormOpen(false)}>Cancelar</button><button type="submit" className="primary-button">{editingId ? 'Guardar cambios' : 'Crear auditoría'}</button></div></form></section></div>}
    </main>
  )
}

export default App
