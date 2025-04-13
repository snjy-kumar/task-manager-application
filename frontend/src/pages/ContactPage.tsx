import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Headphones,
  Building,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-500 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We'd love to hear from you. Our friendly team is always here to help.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <ContactCard
              icon={<MapPin className="h-8 w-8 text-primary" />}
              title="Visit Us"
              description="123 AI Boulevard, San Francisco, CA 94107, USA"
            />
            <ContactCard
              icon={<Phone className="h-8 w-8 text-primary" />}
              title="Call Us"
              description="+1 (555) 123-4567"
            />
            <ContactCard
              icon={<Mail className="h-8 w-8 text-primary" />}
              title="Email Us"
              description="support@aitaskmanager.com"
            />
            <ContactCard
              icon={<Clock className="h-8 w-8 text-primary" />}
              title="Working Hours"
              description="Mon-Fri: 9AM - 6PM (EST)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                    rows={6}
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </motion.div>

            {/* Support Options */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Other Ways to Connect</h2>
              <div className="space-y-6">
                <SupportOption
                  icon={<MessageCircle className="h-6 w-6 text-primary" />}
                  title="Live Chat Support"
                  description="Our chat support is available Monday through Friday from 9AM to 6PM EST."
                  action={<Button variant="outline">Start Chat</Button>}
                />
                <SupportOption
                  icon={<Headphones className="h-6 w-6 text-primary" />}
                  title="Technical Support"
                  description="Having technical issues? Our tech team is ready to help you solve any problems."
                  action={<Button variant="outline">Get Technical Help</Button>}
                />
                <SupportOption
                  icon={<Building className="h-6 w-6 text-primary" />}
                  title="Sales Inquiries"
                  description="Interested in enterprise solutions? Speak with our sales team about custom plans."
                  action={<Button variant="outline">Contact Sales</Button>}
                />
                <SupportOption
                  icon={<Users className="h-6 w-6 text-primary" />}
                  title="Partnership Opportunities"
                  description="Looking to partner with us? Explore how we can work together."
                  action={<Button variant="outline">Become a Partner</Button>}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Us on the Map</h2>
            <p className="text-lg text-gray-500">Our office is located in the heart of San Francisco's tech district.</p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg h-96 bg-gray-200 dark:bg-gray-700">
            {/* Placeholder for an actual map component */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-lg font-medium">Interactive Map Would Go Here</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-500">Find quick answers to common questions about contacting us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FAQItem
              question="What's the best way to contact you?"
              answer="For general inquiries, using the contact form on this page is best. For urgent matters, please call our support line directly."
            />
            <FAQItem
              question="How soon can I expect a response?"
              answer="We aim to respond to all inquiries within 24 hours during business days. Complex technical issues may take longer to resolve."
            />
            <FAQItem
              question="Do you offer support on weekends?"
              answer="Our live support is available on weekdays only, but you can submit support tickets anytime and we'll address them on the next business day."
            />
            <FAQItem
              question="Can I schedule a product demo?"
              answer="Yes! You can request a demo by contacting our sales team through the form above or by directly emailing sales@aitaskmanager.com."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 bg-secondary text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 text-white/80">
              Join thousands of satisfied users who are already boosting their productivity with our platform.
            </p>
            <Button size="lg" asChild className="bg-white/10 text-primary    hover:bg-black">
              <a href="/signup">Start Your Free Trial</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

interface SupportOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

const SupportOption: React.FC<SupportOptionProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="mr-6">
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
        {action}
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-3">{question}</h3>
      <p className="text-gray-500 dark:text-gray-400">{answer}</p>
    </motion.div>
  );
};

export default ContactPage; 