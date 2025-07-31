import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Main';
import Courses from './pages/Courses'
import Students from './pages/Students';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/students" element={<Students />} />
        <Route path="/newAccount" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;