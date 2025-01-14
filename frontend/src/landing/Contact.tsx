import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent: ${message}`);
    setMessage('');
  };

  return (
    <section className="py-12 bg-white text-center">
  <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
  <p className="text-lg text-gray-500 mb-6">Feel free to send us a message, we'd love to hear from you!</p>
  <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
    <div>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <textarea
        placeholder="Your Message"
        rows={4}
        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    <div className="text-center">
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600"
      >
        Send Message
      </button>
    </div>
  </form>
</section>

  );
};

export default Contact;
