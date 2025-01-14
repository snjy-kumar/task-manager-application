import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 p-4 m-auto rounded-xl text-white py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>&copy; 2025 AuthApp. All rights reserved.</p>
        <div className="space-x-6">
          <a href="#" className="hover:text-yellow-400">Facebook</a>
          <a href="#" className="hover:text-yellow-400">Twitter</a>
          <a href="#" className="hover:text-yellow-400">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
