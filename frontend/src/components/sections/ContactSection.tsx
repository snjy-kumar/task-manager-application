import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactSection() {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section id="contact" className="w-full py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-100 dark:bg-pink-900/30 rounded-full blur-3xl opacity-50 animate-float-delayed"></div>
      </div>

      <div className=" px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info Section */}
            <div className="flex flex-col justify-center space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4">
                  Let's Connect
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                  Have questions or want to collaborate? Reach out and let's create something amazing together.
                </p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">contact@aitaskmanager.com</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Phone Number</h3>
                      <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Office Location</h3>
                      <p className="text-gray-600 dark:text-gray-400">123 AI Boulevard, San Francisco, CA</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex space-x-4 mt-6">
                  {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Send Your Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:bg-gray-700/50 transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:bg-gray-700/50 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:bg-gray-700/50 transition-all"
                    placeholder="Message subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:bg-gray-700/50 transition-all"
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5"
                  disabled={isSending}
                >
                  {isSending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}