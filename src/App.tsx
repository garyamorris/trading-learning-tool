import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { TradingPage } from './pages/TradingPage'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<TradingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
