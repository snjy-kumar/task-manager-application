import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full z-10 top-0 left-0 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-blue-600">AuthApp</h1>
        <div className="space-x-8 text-lg">
          <Link to="/" className="text-gray-800 hover:text-blue-600 transition duration-300">Home</Link>
          <Link to="/login" className="text-gray-800 hover:text-blue-600 transition duration-300">Login</Link>
          <Link to="/signup" className="text-gray-800 hover:text-blue-600 transition duration-300">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
