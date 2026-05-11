import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { TradingPage } from './pages/TradingPage'
import { SystemsPage } from './pages/SystemsPage'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<TradingPage />} />
        <Route path="/systems" element={<SystemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
