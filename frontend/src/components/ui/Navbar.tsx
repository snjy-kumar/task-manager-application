import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';



const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col">
      <header 
        className={`px-4 lg:px-6 h-16 sticky top-0 z-50 w-full transition-all duration-300 ${
          scrollY > 50 
            ? 'backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-full mx-auto max-w-7xl">
          <Link className="flex items-center justify-center" to="/">
            <span className="sr-only">AI Task Manager</span>
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="ml-2 text-2xl font-bold">AI Task Manager</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              className={`text-sm font-medium ${isActive('/features') ? 'text-primary' : 'hover:text-primary transition-colors'}`} 
              to="/features"
            >
              Features
            </Link>
            <Link 
              className={`text-sm font-medium ${isActive('/pricing') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
              to="/pricing"
            >
              Pricing
            </Link>
            <Link 
              className={`text-sm font-medium ${isActive('/about') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
              to="/about"
            >
              About
            </Link>
            <Link 
              className={`text-sm font-medium ${isActive('/contact') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
              to="/contact"
            >
              Contact
            </Link>
            <Link 
              className={`text-sm font-medium ${isActive('/blog') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
              to="/blog"
            >
              Blog
            </Link>
            <Link 
              className={`text-sm font-medium ${isActive('/faq') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
              to="/faq"
            >
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 absolute left-0 right-0 px-4 py-5 shadow-lg border-t border-gray-200 dark:border-gray-700"
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                className={`text-base font-medium ${isActive('/features') ? 'text-primary' : ''}`}
                to="/features"
              >
                Features 
              </Link>
              <Link 
                className={`text-base font-medium ${isActive('/pricing') ? 'text-primary' : ''}`}
                to="/pricing"
              >
                Pricing
              </Link>
              <Link 
                className={`text-base font-medium ${isActive('/about') ? 'text-primary' : ''}`}
                to="/about"
              >
                About
              </Link>
              <Link 
                className={`text-base font-medium ${isActive('/contact') ? 'text-primary' : ''}`}
                to="/contact"
              >
                Contact
              </Link>
              <Link 
                className={`text-base font-medium ${isActive('/blog') ? 'text-primary' : ''}`}
                to="/blog"
              >
                Blog
              </Link>
              <Link 
                className={`text-base font-medium ${isActive('/faq') ? 'text-primary' : ''}`}
                to="/faq"
              >
                FAQ
              </Link>
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      {/* <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <Link className="flex items-center mb-4" to="/">
                <CheckCircle className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">AI Task Manager</span>
              </Link>
              <p className="text-gray-400 mb-4">
                Revolutionizing productivity with AI-powered task management.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-primary">AI Intelligence</Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-primary">Productivity Tools</Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-primary">Team Collaboration</Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-primary">Mobile Apps</Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-primary">Integrations</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-primary">Pricing</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-primary">Blog</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-primary">Careers</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-primary">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-primary">Terms of Service</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-primary">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-primary">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AI Task Manager. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Navbar; 