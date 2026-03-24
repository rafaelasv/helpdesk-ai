import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ChatWidget from './ChatWidget'

function Categoria() {
  const { nome } = useParams()
  const [artigos, setArtigos] = useState([])
  const [artigoAberto, setArtigoAberto] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/artigos?categoria=${encodeURIComponent(nome)}`)
      .then(res => res.json())
      .then(data => setArtigos(data))
  }, [nome])

  const mensagemInicial = `Tenho uma dúvida sobre ${nome.toLowerCase()}.`

  return (
    <div className="container container-larga">
      <header className="header">
        <h1>📚 {nome}</h1>
        <p>Artigos e respostas do Theo</p>
      </header>
      <main className="categoria-layout">
        <section className="artigos-lista">
          <h2 className="categorias-titulo">Artigos</h2>
          {artigos.length === 0 && (
            <p className="sem-artigos">Nenhum artigo nessa categoria ainda. Pergunte pro Theo! 🐦</p>
          )}
          {artigos.map(artigo => (
            <div
              key={artigo.id}
              className={`artigo-item ${artigoAberto === artigo.id ? 'aberto' : ''}`}
              onClick={() => setArtigoAberto(artigoAberto === artigo.id ? null : artigo.id)}
            >
              <div className="artigo-pergunta">
                <span>{artigo.pergunta}</span>
                <span className="artigo-seta">{artigoAberto === artigo.id ? '▲' : '▼'}</span>
              </div>
              {artigoAberto === artigo.id && (
                <div className="artigo-resposta">🐦 {artigo.resposta}</div>
              )}
            </div>
          ))}
        </section>
        <section className="chat-lateral">
          <h2 className="categorias-titulo">Pergunte ao Theo</h2>
          <ChatWidget mensagemInicial={mensagemInicial} />
        </section>
      </main>
    </div>
  )
}

export default Categoria
