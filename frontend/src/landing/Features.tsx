import React from 'react';

const Feature: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 text-center">
      <h2 className="text-4xl font-semibold mb-12">Why Choose Us?</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
          <p className="text-gray-600">State-of-the-art encryption methods ensure your users' data is always safe.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
          <p className="text-gray-600">Experience instant login and signup with no unnecessary steps.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-4">Fully Scalable</h3>
          <p className="text-gray-600">As your business grows, our authentication platform grows with you.</p>
        </div>
      </div>
    </section>
  );
};

export default Feature;
