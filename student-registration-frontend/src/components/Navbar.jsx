import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
        <div className='flex justify-between items-center p-2 h-20 w-screen bg-green-600'>
            <h1 className='text-2xl text-white font-bold w-full'>Student Registration the Website</h1>
            <nav className='flex justify-between w-200'>
                <Link className='text-center rounded-lg p-1 w-20 bg-white' to="/home">Home</Link>
                <Link className='text-center rounded-lg p-1 w-20 bg-white' to="/Courses">Courses</Link>
                <Link className='text-center rounded-lg p-1 w-20 bg-white' to="/Students">Students</Link>
                <Link className='text-center rounded-lg p-1 w-20 bg-white' to="/">Logout</Link>
            </nav>
        </div>
    </>

  );
}

export default Navbar;