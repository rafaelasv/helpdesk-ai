import { Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import Chat from './Chat'
import Artigos from './Artigos'
import Revisao from './Revisao'

function App() {
  return (
    <div>
      <nav className="nav">
        <Link to="/">🐦 Help Desk</Link>
        <Link to="/artigos">📚 Base de Conhecimento</Link>
        <Link to="/revisao">✏️ Revisão</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/revisao" element={<Revisao />} />
      </Routes>
    </div>
  )
}

export default App
