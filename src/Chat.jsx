import { useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'

function Chat() {
  const location = useLocation()
  const mensagemInicial = location.state?.mensagemInicial ?? ''

  return (
    <div className="container">
      <header className="header">
        <h1>🐦 Theo Help Desk</h1>
        <p>Converse com o Theo!</p>
      </header>
      <main className="main">
        <ChatWidget mensagemInicial={mensagemInicial} />
      </main>
    </div>
  )
}

export default Chat
