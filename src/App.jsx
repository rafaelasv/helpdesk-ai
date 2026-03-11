import { useState } from 'react'

function App() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [tickets, setTickets] = useState([])

  function abrirTicket() {
    const novoTicket = {
      nome: nome,
      email: email,
      assunto: assunto,
      mensagem: mensagem
    }
    setTickets([...tickets, novoTicket])
  }

  return (
    <div>
      <h1>Help Desk</h1>
      <form>
        <input 
          type="text" 
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Assunto"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
        <textarea 
          placeholder="Descreva seu problema"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button type="button" onClick={abrirTicket}>Abrir Ticket</button>
      </form>
    </div>
  )
}

export default App