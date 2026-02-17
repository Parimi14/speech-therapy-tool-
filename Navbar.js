import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">🏠 Home</Link>
      <Link to="/user">👤 User Details</Link>
      <Link to="/speech">🎙️ Speech Analysis</Link>
      <hr />
    </div>
  );
}

export default Navbar;



