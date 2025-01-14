import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="rounded-xl mt-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-36 text-center relative">
      <h1 className="text-5xl font-extrabold leading-tight mb-6">Welcome to AuthApp</h1>
      <p className="text-lg mb-8">The easiest and most secure way to authenticate your users.</p>
      <Link to="/register">
        <button className="bg-teal-500 hover:bg-teal-400 text-blue-800 font-semibold py-3 px-8 rounded-full text-lg transition duration-300">
          Get Started
        </button>
      </Link>
     
    </section>
  );
};

export default Hero;
