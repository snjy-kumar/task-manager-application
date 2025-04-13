import { motion } from "framer-motion";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "This AI task manager has revolutionized the way I work. I've seen a 40% increase in my daily productivity!",
      author: "Jane Doe",
      title: "Freelance Designer",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=JD",
      rating: 5,
      color: "from-blue-600 to-indigo-600"
    },
    {
      quote: "The AI suggestions are spot-on. It's like having a personal assistant that really understands my work style and priorities.",
      author: "John Smith",
      title: "Project Manager",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=JS",
      rating: 5,
      color: "from-purple-600 to-violet-600"
    },
    {
      quote: "I've tried many task management tools, but this is by far the most intelligent and user-friendly system I've used.",
      author: "Emily Johnson",
      title: "Entrepreneur",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=EJ",
      rating: 4,
      color: "from-rose-600 to-pink-600"
    },
    {
      quote: "The smart scheduling feature saves me hours of planning each week. It's like having a personal assistant.",
      author: "Michael Brown",
      title: "Marketing Director",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=MB",
      rating: 5,
      color: "from-amber-600 to-orange-600"
    },
    {
      quote: "Team collaboration has never been easier. We can now coordinate tasks seamlessly across departments.",
      author: "Sarah Williams",
      title: "HR Manager",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=SW",
      rating: 5,
      color: "from-emerald-600 to-teal-600"
    },
    {
      quote: "The productivity analytics helped me identify where I was wasting time and improve my workflow.",
      author: "David Chen",
      title: "Software Engineer",
      image: "https://placehold.co/100x100/2563eb/FFFFFF/png?text=DC",
      rating: 4,
      color: "from-cyan-600 to-sky-600"
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="w-full py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-48 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        {/* Header with glowing accent */}
        <div className="relative">
          <motion.div 
            className="absolute inset-0 -z-10 mx-auto w-48 h-48 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-full blur-3xl opacity-70"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          <motion.div 
            className="text-center mb-16 md:mb-24 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 dark:border-primary/30"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-primary"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-primary tracking-wide">
                Success Stories
              </span>
            </motion.div>
            
            <motion.h2
              className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Loved by Thousands of Users
            </motion.h2>
            
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 mx-auto my-6 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            <motion.p
              className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              See how TaskAI has transformed productivity for professionals across industries
            </motion.p>
          </motion.div>
        </div>

        {/* Featured testimonial carousel */}
        <div className="mb-20 relative">
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-blue-600/5 dark:from-primary/10 dark:to-blue-600/10 rounded-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />

          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="relative rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center">
                <motion.div 
                  className="md:w-1/3 flex flex-col items-center md:items-start"
                  key={`image-${activeIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeIndex].color} opacity-20 rounded-full blur-md`} />
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                      <img 
                        src={testimonials[activeIndex].image} 
                        alt={testimonials[activeIndex].author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center md:text-left">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{testimonials[activeIndex].author}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonials[activeIndex].title}</p>
                    
                    <div className="flex justify-center md:justify-start mt-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: i < testimonials[activeIndex].rating ? 1 : 0.3,
                            scale: 1 
                          }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star 
                            className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="md:w-2/3 relative"
                  key={`quote-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Quote className="absolute top-0 left-0 w-12 h-12 text-primary/20 -translate-x-4 -translate-y-4" />
                  <blockquote>
                    <p className="text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 italic">
                      "{testimonials[activeIndex].quote}"
                    </p>
                  </blockquote>
                  <Quote className="absolute bottom-0 right-0 w-12 h-12 text-primary/20 translate-x-4 translate-y-4 rotate-180" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Navigation controls */}
            <div className="flex justify-center mt-8 gap-4">
              <motion.button
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevTestimonial}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
              
              <motion.button
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextTestimonial}
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Testimonial cards in staggered grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          <TestimonialCard
            quote="The patterns it recognized in my work style helped me optimize my day."
            author="Alex Rivera"
            title="Content Creator"
            rating={5}
            className="md:col-span-3"
          />
          <TestimonialCard
            quote="I'm saving at least 5 hours every week on task planning alone."
            author="Priya Sharma"
            title="UX Researcher"
            rating={4}
            className="md:col-span-3"
          />
          <TestimonialCard
            quote="It adapts to how I work rather than forcing me into a rigid system."
            author="Robert Kim"
            title="Product Manager"
            rating={5}
            className="md:col-span-2"
          />
          <TestimonialCard
            quote="The AI prioritization is incredibly accurate."
            author="Taylor Jackson"
            title="Freelancer"
            rating={5}
            className="md:col-span-2"
          />
          <TestimonialCard
            quote="Best investment for my productivity this year!"
            author="Maria Garcia"
            title="Student"
            rating={5}
            className="md:col-span-2"
          />
        </motion.div>

        {/* User crowd section */}
        <motion.div 
          className="flex flex-col items-center justify-center gap-6 mt-16 md:mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-full blur-xl opacity-70" />
            <div className="relative flex -space-x-3 hover:-space-x-1 transition-all duration-300">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div 
                  key={i} 
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-lg hover:scale-110 transition-transform z-10 hover:z-20"
                  initial={{ x: i * 5, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, zIndex: 20 }}
                >
                  <img 
                    src={`https://placehold.co/100x100/2563eb/FFFFFF/png?text=${i}`} 
                    alt={`User ${i}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-gray-800 shadow-lg z-10 hover:z-20"
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                +2.5k
              </motion.div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium mb-2">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent font-bold">
                Join our growing community
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              People are transforming their productivity every day with TaskAI
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  image?: string;
  rating?: number;
  className?: string;
}

function TestimonialCard({ quote, author, title, image, rating = 5, className = "" }: TestimonialCardProps) {
  return (
    <motion.div
      className={`group relative p-6 rounded-xl hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 hover:border-primary/30 dark:hover:border-primary/30 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
    >
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Star
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
            />
          </motion.div>
        ))}
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-4 relative leading-relaxed">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-3">
        {image ? (
          <img 
            src={image} 
            alt={author}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {author.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{author}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Quote className="h-6 w-6 text-primary/40" />
      </div>
    </motion.div>
  );
}