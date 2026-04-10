import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Browse from './pages/Browse'
import Bathroom from './pages/Bathroom'
import Add from './pages/Add'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Browse</Link> | 
        <Link to="/add">Add Bathroom</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/bathroom/:id" element={<Bathroom />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </BrowserRouter>
  )
}