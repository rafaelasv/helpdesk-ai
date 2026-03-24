import { useState, useEffect, useRef } from 'react'

function ChatWidget({ mensagemInicial = '' }) {
  const [mensagens, setMensagens] = useState([
    { autor: 'theo', texto: 'Oi! Sou o Theo 🐦 Pode me contar sua dúvida sobre aves!' }
  ])
  const [input, setInput] = useState(mensagemInicial)
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, carregando])

  async function enviar() {
    if (!input.trim() || carregando) return

    const textoUsuario = input
    setInput('')
    setMensagens(prev => [...prev, { autor: 'user', texto: textoUsuario }])
    setCarregando(true)

    const res = await fetch('http://127.0.0.1:5000/responder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: textoUsuario })
    })
    const dados = await res.json()

    setCarregando(false)
    setMensagens(prev => [...prev, { autor: 'theo', texto: dados.resposta }])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-mensagens">
        {mensagens.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg-${msg.autor}`}>
            {msg.autor === 'theo' && <span className="chat-avatar">🐦</span>}
            <div className="chat-balao">{msg.texto}</div>
          </div>
        ))}
        {carregando && (
          <div className="chat-msg chat-msg-theo">
            <span className="chat-avatar">🐦</span>
            <div className="chat-balao"><span className="digitando">...</span></div>
          </div>
        )}
        <div ref={fimRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          rows={2}
          placeholder="Digite sua dúvida... (Enter para enviar)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={enviar} disabled={carregando}>Enviar 🌿</button>
      </div>
    </div>
  )
}

export default ChatWidget
