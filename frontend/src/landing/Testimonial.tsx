import React from 'react';

const Testimonial: React.FC = () => {
  return (
    <section className="bg-gray-100 py-24 text-center">
    <h2 className="text-4xl font-semibold mb-12">What Our Users Say</h2>
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {/* Testimonial 1 */}
      <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
        <p className="italic text-xl mb-4">"AuthApp is the best authentication solution we've used. It's fast, reliable, and secure!"</p>
        <p className="font-semibold text-lg">John Doe</p>
        <p className="text-gray-500">CEO, TechSolutions</p>
      </div>
      
      {/* Testimonial 2 */}
      <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
        <p className="italic text-xl mb-4">"User experience is seamless, and the security features are top-notch!"</p>
        <p className="font-semibold text-lg">Jane Smith</p>
        <p className="text-gray-500">CTO, WebDev Inc.</p>
      </div>
      
      {/* Testimonial 3 */}
      <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
        <p className="italic text-xl mb-4">"The platform's scalability is perfect for our growing business. Highly recommended!"</p>
        <p className="font-semibold text-lg">Mark Lee</p>
        <p className="text-gray-500">Founder, DevHub</p>
      </div>
    </div>
  </section>
  
  );
};

export default Testimonial;
