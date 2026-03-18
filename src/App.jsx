import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Artigos from './Artigos'
import Revisao from './Revisao'


function App() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [tickets, setTickets] = useState([])
  const [respostaIA, setRespostaIA] = useState("")
  const [carregando, setCarregando] = useState(false)

  function abrirTicket() {
    const novoTicket = {
      nome: nome,
      email: email,
      assunto: assunto,
      mensagem: mensagem
    }
    setTickets([...tickets, novoTicket])

    chamarIA(mensagem)

    setNome("")
    setEmail("")
    setAssunto("")
    setMensagem("")
  }

  async function chamarIA(mensagemUsuario) {
    setCarregando(true)
    const res = await fetch("http://127.0.0.1:5000/responder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: mensagemUsuario })
    })
    const dados = await res.json()
    setRespostaIA(dados.resposta)
    setCarregando(false)
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/">🐦 Help Desk</Link>
        <Link to="/artigos">📚 Base de Conhecimento</Link>
        <Link to="/revisao">✏️ Revisão</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="container">
            <header className="header">
              <h1>🐦 Theo Help Desk</h1>
              <p>Dúvidas sobre sua ave? O Theo responde!</p>
            </header>
            <main className="main">
              <div className="form-card">
                <h2>Abrir chamado</h2>
                <div className="form-grid">
                  <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                  <input type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <input type="text" placeholder="Assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
                <textarea rows={4} placeholder="Descreva seu problema" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
                <button type="button" onClick={abrirTicket}>Abrir Ticket 🌿</button>
              </div>
              <div className="tickets">
                {tickets.map((ticket, index) => (
                  <div key={index} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-nome">{ticket.nome}</span>
                      <span className="ticket-assunto">{ticket.assunto}</span>
                    </div>
                    <p className="ticket-mensagem">{ticket.mensagem}</p>
                    {respostaIA && <div className="resposta-ia">🐦 <strong>Theo:</strong> {respostaIA}</div>}
                  </div>
                ))}
              </div>
            </main>
          </div>
        } />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/revisao" element={<Revisao />} />
      </Routes>
    </div>
  )
}

export default App