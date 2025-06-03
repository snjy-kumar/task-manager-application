import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Close mobile menu when path changes
  useEffect(() => {
    // Implementation would go here
  }, [location.pathname]);

  return (
    <div  >
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout; 