import { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })


function App() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [tickets, setTickets] = useState([])
  const [respostaIA, setRespostaIA] = useState("")

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
    const prompt = `Você é o Theo, uma calopsita manhosa, preguiçosa e um pouco bobinha, mas muito calminha. Você responde perguntas sobre aves com tranquilidade, sem pressa nenhuma. Às vezes você se distrai ou fala algo meio sem sentido, mas sempre com boa vontade. Responda de forma curta e no estilo de quem tá com sono. Dúvida do usuário: ${mensagemUsuario}`
    
    const result = await model.generateContent(prompt)
    const resposta = result.response.text()
    setRespostaIA(resposta)
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

      <div>
        {tickets.map((ticket, index) => (
          <div key={index}>
            <p>{ticket.nome}</p>
            <p>{ticket.assunto}</p>
            <p>{ticket.mensagem}</p>
          </div>
        ))}
      </div>

      {respostaIA && <p>{respostaIA}</p>}

    </div>
  )
}

export default App