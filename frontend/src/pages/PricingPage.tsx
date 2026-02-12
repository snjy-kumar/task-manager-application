import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  X,
  HelpCircle,
  Shield,
  Zap,
  Users,
  Database,
  Server,
  CloudOff,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose the perfect plan for your productivity needs with no hidden fees.
            </motion.p>
            
            <motion.div
              className="inline-flex items-center bg-white/10 p-1 rounded-full mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white'}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${billingCycle === 'annual' ? 'bg-white text-black' : 'text-white'}`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual (20% off)
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="w-full py-16 -mt-8">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <PricingCard
              name="Free"
              description="Perfect for individuals getting started"
              price={billingCycle === 'monthly' ? '0' : '0'}
              period={billingCycle === 'monthly' ? '/month' : '/year'}
              buttonText="Get Started"
              buttonLink="/signup?plan=free"
              features={[
                { name: "Up to 3 projects", included: true },
                { name: "Basic AI task suggestions", included: true },
                { name: "Simple task scheduling", included: true },
                { name: "Basic analytics", included: true },
                { name: "Mobile app access", included: true },
                { name: "Email support", included: true },
                { name: "Team collaboration", included: false },
                { name: "Advanced analytics", included: false },
                { name: "Unlimited storage", included: false },
                { name: "Priority support", included: false },
                { name: "Custom integrations", included: false },
              ]}
            />
            
            {/* Pro Plan */}
            <PricingCard
              name="Pro"
              description="Ideal for professionals and small teams"
              price={billingCycle === 'monthly' ? '19.99' : '191.90'}
              period={billingCycle === 'monthly' ? '/month' : '/year'}
              buttonText="Start Free Trial"
              buttonLink="/signup?plan=pro"
              popular={true}
              features={[
                { name: "Unlimited projects", included: true },
                { name: "Full AI task suggestions", included: true },
                { name: "Smart scheduling", included: true },
                { name: "Advanced analytics", included: true },
                { name: "Mobile app access", included: true },
                { name: "Priority email support", included: true },
                { name: "Team collaboration (up to 5 users)", included: true },
                { name: "10GB storage", included: true },
                { name: "API access", included: true },
                { name: "Standard integrations", included: true },
                { name: "Custom integrations", included: false },
              ]}
            />
            
            {/* Enterprise Plan */}
            <PricingCard
              name="Enterprise"
              description="For large teams and organizations"
              price="Custom"
              period=""
              buttonText="Contact Sales"
              buttonLink="/contact"
              features={[
                { name: "Unlimited everything", included: true },
                { name: "Custom AI training", included: true },
                { name: "Dedicated account manager", included: true },
                { name: "24/7 phone & email support", included: true },
                { name: "Enterprise SSO", included: true },
                { name: "Advanced security", included: true },
                { name: "Team collaboration (unlimited)", included: true },
                { name: "Unlimited storage", included: true },
                { name: "Custom API access", included: true },
                { name: "Custom integrations", included: true },
                { name: "On-premise deployment option", included: true },
              ]}
            />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Have questions? Contact our sales team
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Plans in Detail</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              See all features and capabilities of each plan to make the right choice for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-left">Features</th>
                  <th className="py-4 px-6 text-center">Free</th>
                  <th className="py-4 px-6 text-center bg-gray-200 dark:bg-gray-800/20">Pro</th>
                  <th className="py-4 px-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <FeatureRow 
                  name="Projects" 
                  free="Up to 3" 
                  pro="Unlimited" 
                  enterprise="Unlimited" 
                  icon={<Database className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="AI Task Suggestions" 
                  free="Basic" 
                  pro="Advanced" 
                  enterprise="Custom Trained" 
                  icon={<Zap className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Team Members" 
                  free="1" 
                  pro="Up to 5" 
                  enterprise="Unlimited" 
                  icon={<Users className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Storage" 
                  free="1GB" 
                  pro="10GB" 
                  enterprise="Unlimited" 
                  icon={<Database className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Analytics" 
                  free="Basic" 
                  pro="Advanced" 
                  enterprise="Custom Reports" 
                  icon={<BarChart className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Support" 
                  free="Email" 
                  pro="Priority Email" 
                  enterprise="24/7 Phone & Email" 
                  icon={<HelpCircle className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Security" 
                  free="Standard" 
                  pro="Enhanced" 
                  enterprise="Enterprise-grade" 
                  icon={<Shield className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="API Access" 
                  free={false} 
                  pro="Limited" 
                  enterprise="Full" 
                  icon={<Server className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Offline Mode" 
                  free={false} 
                  pro={true} 
                  enterprise={true} 
                  icon={<CloudOff className="h-5 w-5 text-primary" />}
                />
                <FeatureRow 
                  name="Data Export" 
                  free="CSV" 
                  pro="CSV, JSON" 
                  enterprise="All Formats" 
                  icon={<Download className="h-5 w-5 text-primary" />}
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Answers to common questions about our pricing and plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FAQItem
              question="Can I switch plans at any time?"
              answer="Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be immediately available. When downgrading, the changes will take effect at the start of your next billing cycle."
            />
            <FAQItem
              question="How does the 14-day trial work?"
              answer="Our 14-day trial gives you full access to all Pro plan features without requiring a credit card. At the end of the trial, you can choose to subscribe or your account will automatically revert to the Free plan."
            />
            <FAQItem
              question="Do you offer discounts for non-profits?"
              answer="Yes, we offer special pricing for non-profit organizations, educational institutions, and open-source projects. Please contact our sales team for more information."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and can arrange for wire transfers for annual Enterprise subscriptions."
            />
            <FAQItem
              question="Can I get a refund if I'm not satisfied?"
              answer="We offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team within 30 days of your purchase for a full refund."
            />
            <FAQItem
              question="How does annual billing work?"
              answer="Annual billing is charged once per year and offers a 20% discount over monthly billing. You'll be charged the full annual amount at the beginning of each billing cycle."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 text-white/80">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <p className="mt-4 text-sm text-white/70">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  buttonText: string;
  buttonLink: string;
  features: Array<{ name: string, included: boolean }>;
  popular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  description, 
  price, 
  period, 
  buttonText, 
  buttonLink,
  features,
  popular = false 
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden ${popular ? 'border-2 border-primary ring-4 ring-primary/10 relative z-10 md:-my-4 md:py-2' : 'border border-gray-200 dark:border-gray-700'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {popular && (
        <div className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1 absolute top-4 right-4 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-500 dark:text-gray-400">{period}</span>
        </div>
        
        <Button asChild className={`w-full ${popular ? 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200' : ''}`}>
          <Link to={buttonLink}>
            {buttonText}
          </Link>
        </Button>
      </div>
      
      <div className="px-6 pb-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-bold uppercase mb-4 text-gray-500 dark:text-gray-400">What's included</h4>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              {feature.included ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <span className={feature.included ? '' : 'text-gray-400 dark:text-gray-500'}>{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

interface FeatureRowProps {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
  icon?: React.ReactNode;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ name, free, pro, enterprise, icon }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-4 px-6 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {name}
      </td>
      <td className="py-4 px-6 text-center">
        {typeof free === 'boolean' ? (
          free ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
        ) : (
          free
        )}
      </td>
      <td className="py-4 px-6 text-center bg-gray-200 dark:bg-gray-800/20">
        {typeof pro === 'boolean' ? (
          pro ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
        ) : (
          pro
        )}
      </td>
      <td className="py-4 px-6 text-center">
        {typeof enterprise === 'boolean' ? (
          enterprise ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
        ) : (
          enterprise
        )}
      </td>
    </tr>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
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

export default PricingPage; 