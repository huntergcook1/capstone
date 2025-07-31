import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Main';
import Courses from './routes/Courses'
import Students from './routes/Students';
import Register from './routes/Register';
import Navbar from './components/Navbar';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
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