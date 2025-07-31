import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
        <div className='flex justify-between items-center p-2 h-20 bg-green-500'>
            <h1>Student Registration the Website</h1>
            <nav >
            <Link to="/">Home</Link> | <Link to="/Courses">Courses</Link> | <Link to="/Students">Students</Link>
            </nav>
        </div>
    </>

  );
}

export default Navbar;