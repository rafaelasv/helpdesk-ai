import { useState } from 'react'

const categorias = ['Alimentação', 'Saúde', 'Comportamento', 'Moradia e ambiente', 'Filhotes', 'Geral']

function NovoArtigo() {
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')
  const [categoria, setCategoria] = useState('Geral')
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function salvar() {
    if (!pergunta.trim() || !resposta.trim()) return

    setSalvando(true)
    await fetch('http://127.0.0.1:5000/artigos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, resposta, categoria, status: 'oficial' })
    })

    setSalvando(false)
    setSucesso(true)
    setPergunta('')
    setResposta('')
    setCategoria('Geral')
    setTimeout(() => setSucesso(false), 3000)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>📝 Novo Artigo</h1>
        <p>Adicione um artigo à base de conhecimento</p>
      </header>
      <main className="main">
        <div className="form-card">
          <div className="form-field">
            <label>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Pergunta</label>
            <input
              type="text"
              placeholder="Ex: Calopsita pode comer maçã?"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Resposta</label>
            <textarea
              rows={6}
              placeholder="Escreva a resposta completa..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
          </div>
          {sucesso && <p className="msg-sucesso">Artigo salvo com sucesso! 🌿</p>}
          <button onClick={salvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Artigo 🌿'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default NovoArtigo
