import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        setError('');
        console.log('Login success:', data);
      }
    } catch (err) {
      setError('Email or Password Incorrect');
    }
  }

  return (
    <>
      <Navbar/>
      <div className='flex justify-center items-center w-full'>
          <div className='flex flex-col justify-center gap-5 p-10 mt-40 h-100 w-80 rounded-xl bg-green-600'>
              <h1>Login</h1>
              <form className='flex flex-col gap-1 w-full' onSubmit={handleSubmit}>
                  <input className='border border-solid rounded p-1 bg-white' name="email" type="email" placeholder="Email" onChange={handleChange} required />
                  <input className='border border-solid rounded p-1 bg-white' name="password" type="password" placeholder="Password" onChange={handleChange} required />
                  <button className='border border-solid rounded p-1 bg-white' type="submit">Login</button>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Link to="/newAccount">Register</Link>
          </div>
      </div>
    </>
  );
}

export default Login;