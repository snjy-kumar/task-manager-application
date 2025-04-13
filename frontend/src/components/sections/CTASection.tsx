import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight,  CheckCircle, Star, Zap, Users, Award, TrendingUp,   } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTASection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    
    const x = clientX - left;
    const y = clientY - top;
    
    setMousePosition({ x, y });
  };

  return (
    <section 
      id="cta" 
      ref={ref}
      className="w-full py-16 lg:py-20 min-h-[85vh] flex items-center relative overflow-hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-900 dark:from-indigo-950 dark:via-blue-950 dark:to-purple-950"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.07] dark:opacity-[0.05]" />
        <motion.div 
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 dark:from-purple-500/20 dark:to-fuchsia-500/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15) 0%, rgba(13, 16, 45, 0) 50%)`,
          }}
        />
        
        {/* Floating glowing particles */}
        <div className="absolute inset-0">
          {Array(8).fill(0).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400/60 backdrop-blur-sm"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left section: Heading and description */}
          <div className="lg:col-span-2 lg:pl-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 dark:bg-white/5 dark:border-white/10">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-semibold text-white">Premium Experience</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
              }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200 dark:from-blue-100 dark:via-indigo-100 dark:to-purple-100 pb-2 drop-shadow-sm">
                Transform Your Productivity Today
              </h2>
              
              <motion.div
                className="h-1 w-32 md:w-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full my-5"
                initial={{ width: 0, opacity: 0 }}
                animate={controls}
                variants={{
                  visible: { width: 160, opacity: 1, transition: { duration: 1, delay: 0.3 } }
                }}
              />
              
              <motion.p 
                className="text-lg text-blue-100/90 dark:text-blue-50/90 my-6 leading-relaxed max-w-xl"
                initial={{ opacity: 0 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, transition: { duration: 0.7, delay: 0.2 } }
                }}
              >
                Join over 10,000 professionals who have already supercharged their workflow with our AI-powered task management system.
              </motion.p>

              {/* Feature highlights */}
              <motion.div 
                className="flex flex-wrap gap-3 my-6"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
                }}
              >
                {[
                  { icon: <Zap size={16} />, text: "40% Time Saved" },
                  { icon: <TrendingUp size={16} />, text: "Increased Focus" },
                  { icon: <Users size={16} />, text: "Team Synergy" },
                  { icon: <Award size={16} />, text: "Premium Support" }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm dark:bg-white/5"
                  >
                    <div className="text-blue-300">{item.icon}</div>
                    <span className="text-sm font-medium text-blue-100 dark:text-blue-50">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right section: Stats and CTA */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
              {[
                { value: "10K+", label: "Active Users", description: "Professionals trust our platform" },
                { value: "98%", label: "Satisfaction", description: "From verified customer reviews" },
                { value: "24/7", label: "Premium Support", description: "Always there when you need help" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 + (index * 0.1) } }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-5 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 dark:from-white/8 dark:to-white/3 transition-all duration-300 shadow-lg"
                >
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-200 dark:to-purple-200">
                      {item.value}
                    </span>
                    <span className="text-base font-medium text-blue-100 dark:text-blue-50">{item.label}</span>
                    <span className="text-xs text-blue-200/80 dark:text-blue-100/70">{item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Box */}
            <motion.div
              className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/15 dark:bg-white/5 dark:border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white dark:text-white mb-2">Ready to get started?</h3>
                  <p className="text-blue-100 dark:text-blue-50/90 max-w-md">Experience the future of task management with our AI-powered platform.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="group h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    <Link to="/signup">
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 font-semibold"
                      >
                        Start Free Trial
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-6 rounded-xl border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 dark:border-white/20 dark:hover:border-white/40 transition-colors duration-300 text-white"
                  >
                    <Link to="/contact" className="font-semibold flex items-center gap-2">
                      Watch Demo
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-3 border-t-transparent border-l-6 border-l-white border-b-3 border-b-transparent ml-0.5"></div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mt-6 text-blue-100 dark:text-blue-50/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" /> 
                  <span className="text-sm">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" /> 
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" /> 
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}