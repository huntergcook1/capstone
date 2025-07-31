import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Main';
import Courses from './pages/Courses'
import Students from './pages/Students';
import Navbar from './components/Navbar';
// import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/Students" element={<Students />} />
      </Routes>
    </Router>
  )
}

export default App;