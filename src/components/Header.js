import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/board" className="text-xl font-bold"><h1>Task Manager</h1></Link>
        <nav className="flex items-center">
          {user ? (
            <>
              <div className="flex items-center">
                {user.avatar && <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />}
                <span className="mr-4">{user.username}</span>
              </div>
              <button
                onClick={() => navigate('/create-task')}
                className="bg-green-500 px-4 py-2 rounded mr-4"
              >
                Create Task
              </button>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup" className="bg-green-500 px-4 py-2 rounded">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
