import Contact from "./Contact";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Testimonial from "./Testimonial";

 

const Main: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default Main;
