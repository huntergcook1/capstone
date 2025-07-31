import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Call your backend API here to register the user
    console.log('Registering user:', formData);
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
        <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} required />
        <input name="address" type="text" placeholder="Address" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
        <Link to='/'>Already Have an account?</Link>
      </form>
    </>
  );
}

export default Register;