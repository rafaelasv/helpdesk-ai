import { useState, useEffect } from 'react'

function Artigos() {
  const [artigos, setArtigos] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/artigos")
      .then(res => res.json())
      .then(data => setArtigos(data))
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>📚 Base de Conhecimento</h1>
        <p>Artigos criados pelo Theo</p>
      </header>

      <main className="main">
        {artigos.map(artigo => (
          <div key={artigo.id} className="ticket-card">
            <div className="ticket-header">
              <span className="ticket-assunto">#{artigo.id}</span>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>{artigo.criado_em}</span>
            </div>
            <p className="ticket-nome">{artigo.pergunta}</p>
            <div className="resposta-ia">
              🐦 {artigo.resposta}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Artigos