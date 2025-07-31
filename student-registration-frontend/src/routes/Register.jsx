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
    console.log('Registering user:', formData);
  }

  return (
    <>
      <div className='flex justify-center items-center w-full'>
        <div className='flex flex-col justify-center gap-5 p-10 mt-40 h-100 w-80 rounded-xl bg-green-600'>
          <h1 className='font-bold text-xl text-white'>Register</h1>
          <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
            <input className='border border-solid rounded p-1 bg-white' name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
            <input className='border border-solid rounded p-1 bg-white' name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
            <input className='border border-solid rounded p-1 bg-white' name="phone" type="text" placeholder="Phone Number" onChange={handleChange} required />
            <input className='border border-solid rounded p-1 bg-white' name="address" type="text" placeholder="Address" onChange={handleChange} required />
            <input className='border border-solid rounded p-1 bg-white' name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input className='border border-solid rounded p-1 bg-white' name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button className='border border-solid rounded p-1 bg-white' type="submit">Register</button>
            <Link to='/'>Already Have an account?</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;