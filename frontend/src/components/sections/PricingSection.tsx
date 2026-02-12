import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-semibold text-primary/80 dark:text-primary/90 mb-4 tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Transparent Pricing
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Simple Plans, Powerful Features
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <PricingCard
            title="Starter"
            price="9"
            period="month"
            description="Perfect for individuals and small teams"
            features={[
              "Up to 3 projects",
              "Basic AI suggestions",
              "1GB storage",
              "Email support",
              "Standard analytics"
            ]}
            cta="Start Free Trial"
            ctaLink="/signup?plan=basic"
          />
          <PricingCard
            title="Professional"
            price="19"
            period="month"
            description="Best for growing teams and businesses"
            features={[
              "Unlimited projects",
              "Advanced AI features",
              "10GB storage",
              "Priority support",
              "Team collaboration",
              "Custom integrations",
              "Advanced analytics"
            ]}
            highlighted={true}
            popularTag={true}
            cta="Get Professional"
            ctaLink="/signup?plan=pro"
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            period=""
            description="Tailored solutions for large organizations"
            features={[
              "Everything in Pro",
              "Custom AI training",
              "Unlimited storage",
              "Dedicated support",
              "SSO & SAML",
              "API access",
              "Custom SLAs"
            ]}
            cta="Contact Sales"
            ctaLink="/contact"
          />
        </motion.div>

        <motion.div
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          All plans include SOC2 compliance and GDPR-ready infrastructure
        </motion.div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  popularTag?: boolean;
  cta?: string;
  ctaLink?: string;
}

function PricingCard({ 
  title, 
  price, 
  period = "month", 
  description, 
  features, 
  highlighted = false,
  popularTag = false,
  cta = "Choose Plan",
  ctaLink = "#"
}: PricingCardProps) {
  return (
    <motion.div
      className={`group relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
        highlighted 
          ? "bg-black dark:bg-white shadow-2xl border-0" 
          : "bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700"
      } ${highlighted ? "lg:scale-110 z-10" : ""}`}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {popularTag && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold py-2 px-4 rounded-full shadow-md flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Most Popular
        </div>
      )}
      
      <div className="flex-1">
        <h3 className={`text-2xl font-bold mb-3 ${highlighted ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
          {title}
        </h3>
        
        {description && (
          <p className={`text-sm mb-6 ${highlighted ? "text-primary-100/90" : "text-gray-500 dark:text-gray-400"}`}>
            {description}
          </p>
        )}
        
        <div className="flex items-end mb-8">
          <span className={`text-4xl font-bold ${highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
            ${price}
          </span>
          {period && (
            <span className={`ml-2 ${highlighted ? "text-primary-100/80" : "text-gray-500 dark:text-gray-400"}`}>
              /{period}
            </span>
          )}
        </div>

        <ul className="space-y-3.5 mb-8">
          {features.map((feature, index) => (
            <li 
              key={index}
              className="flex items-start"
            >
              <CheckCircle className={`h-5 w-5 mr-3 mt-0.5 ${highlighted ? "text-primary-200" : "text-green-500"}`} />
              <span className={`${highlighted ? "text-primary-50/90" : "text-gray-600 dark:text-gray-300"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        asChild
        size="lg"
        className={`w-full rounded-lg font-semibold transition-transform ${
          highlighted 
            ? "bg-white dark:bg-gray-900 text-primary hover:bg-gray-50 hover:scale-[1.02] shadow-md" 
            : "hover:scale-[1.02]"
        }`}
      >
        <Link to={ctaLink}>
          {cta} {highlighted && <Zap className="h-4 w-4 ml-2 fill-primary" />}
        </Link>
      </Button>
    </motion.div>
  );
}