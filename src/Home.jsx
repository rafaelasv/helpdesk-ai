import { useNavigate } from 'react-router-dom'

const categorias = [
  { emoji: '🌾', titulo: 'Alimentação', mensagem: 'Tenho uma dúvida sobre alimentação da minha ave.' },
  { emoji: '🏥', titulo: 'Saúde', mensagem: 'Tenho uma dúvida sobre a saúde da minha ave.' },
  { emoji: '🎭', titulo: 'Comportamento', mensagem: 'Tenho uma dúvida sobre o comportamento da minha ave.' },
  { emoji: '🏠', titulo: 'Moradia e ambiente', mensagem: 'Tenho uma dúvida sobre moradia e ambiente para minha ave.' },
  { emoji: '🐣', titulo: 'Filhotes', mensagem: 'Tenho uma dúvida sobre filhotes de ave.' },
  { emoji: '❓', titulo: 'Dúvida geral', mensagem: '' },
]

function Home() {
  const navigate = useNavigate()

  function irParaChat(mensagem) {
    navigate('/chat', { state: { mensagemInicial: mensagem } })
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🐦 Theo Help Desk</h1>
        <p>Dúvidas sobre sua ave? O Theo responde!</p>
      </header>
      <main className="main">
        <h2 className="categorias-titulo">O que você precisa saber?</h2>
        <div className="categorias-grid">
          {categorias.map((cat) => (
            <button
              key={cat.titulo}
              className="categoria-card"
              onClick={() => irParaChat(cat.mensagem)}
            >
              <span className="categoria-emoji">{cat.emoji}</span>
              <span className="categoria-nome">{cat.titulo}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
