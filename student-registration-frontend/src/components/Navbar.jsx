import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/Courses">Courses</Link> | <Link to="/Students">Students</Link>
    </nav>
  );
}

export default Navbar;