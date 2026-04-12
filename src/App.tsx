import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Browse from './pages/Browse'
import Bathroom from './pages/Bathroom'
import Add from './pages/Add'

// The main app component. Allows "routing" to different pages using React Router! Yay!
// Has upper navigation bar for accessing different pages
// and defines routes (i.e. URL paths) for the browse page, individual bathroom pages, and the add page.

// TODO: add a map page...?

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Browse</Link> | 
        <Link to="/add">Add Bathroom</Link> |
        <span style={{ color: 'rgb(218, 112, 112)' }}>Bathroom Map (not yet implemented)</span>
      </nav>
      <Routes>
        <Route path="/" element={<Browse />} /> 
        <Route path="/bathroom/:id" element={<Bathroom />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </BrowserRouter>
  )
}

// NOTE: according to React Router docs, can use useParams to access bathroom id from URL.

export default App