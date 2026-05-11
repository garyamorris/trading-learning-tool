import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { TradingPage } from './pages/TradingPage'
import { SystemsPage } from './pages/SystemsPage'
import { MiddleOfficePage } from './pages/MiddleOfficePage'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<TradingPage />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/middle" element={<MiddleOfficePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
