import { useState, useEffect } from 'react'

function Revisao() {
  const [pendentes, setPendentes] = useState([])
  const [editando, setEditando] = useState({})

  useEffect(() => {
    fetch("http://127.0.0.1:5000/revisao")
      .then(res => res.json())
      .then(data => {
        setPendentes(data)
        const edits = {}
        data.forEach(a => {
          edits[a.id] = { resposta: a.resposta, categoria: a.categoria }
        })
        setEditando(edits)
      })
  }, [])

  async function aprovar(id) {
    await fetch(`http://127.0.0.1:5000/artigos/${id}/aprovar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando[id])
    })
    setPendentes(pendentes.filter(a => a.id !== id))
  }

  return (
    <div className="container">
      <header className="header">
        <h1>✏️ Fila de Revisão</h1>
        <p>Artigos gerados pelo Theo aguardando aprovação</p>
      </header>

      <main className="main">
        {pendentes.length === 0 && <p style={{textAlign: 'center', color: '#999'}}>Nenhum artigo pendente! 🎉</p>}
        {pendentes.map(artigo => (
          <div key={artigo.id} className="ticket-card">
            <p className="ticket-nome">{artigo.pergunta}</p>
            <select
              value={editando[artigo.id]?.categoria}
              onChange={(e) => setEditando({...editando, [artigo.id]: {...editando[artigo.id], categoria: e.target.value}})}
              style={{ margin: '12px 0', padding: '8px', borderRadius: '12px', border: '2px solid #e8d9b5', fontFamily: 'Nunito' }}
            >
              <option>Alimentação</option>
              <option>Saúde</option>
              <option>Comportamento</option>
              <option>Ambiente</option>
              <option>Geral</option>
            </select>
            <textarea
              rows={5}
              value={editando[artigo.id]?.resposta || ""}
              onChange={(e) => setEditando({...editando, [artigo.id]: {...editando[artigo.id], resposta: e.target.value}})}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e8d9b5', fontFamily: 'Nunito', marginBottom: '12px' }}
            />
            <button onClick={() => aprovar(artigo.id)}>✅ Aprovar e publicar</button>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Revisao