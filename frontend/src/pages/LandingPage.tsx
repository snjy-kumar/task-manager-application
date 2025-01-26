
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, BarChart, Calendar, Settings, HelpCircle, User } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="#">
          <span className="sr-only">AI Task Manager</span>
          <CheckCircle className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">AI Task Manager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Task Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Boost your productivity with intelligent task suggestions and automated workflows.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button asChild>
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 mb-4" />}
                title="AI Task Suggestions"
                description="Get intelligent task recommendations based on your work patterns and priorities."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 mb-4" />}
                title="Smart Scheduling"
                description="Automatically schedule tasks based on your availability and task urgency."
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10 mb-4" />}
                title="Productivity Analytics"
                description="Gain insights into your productivity trends and task completion rates."
              />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="Add Your Tasks"
                description="Input your tasks or let our AI suggest tasks based on your goals."
              />
              <StepCard
                number={2}
                title="AI Optimization"
                description="Our AI analyzes your tasks and optimizes your schedule for maximum productivity."
              />
              <StepCard
                number={3}
                title="Execute and Track"
                description="Complete your tasks and track your progress with real-time updates."
              />
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="This AI task manager has revolutionized the way I work. I'm more productive than ever!"
                author="Jane Doe"
                title="Freelance Designer"
              />
              <TestimonialCard
                quote="The AI suggestions are spot-on. It's like having a personal assistant that really understands my work style."
                author="John Smith"
                title="Project Manager"
              />
              <TestimonialCard
                quote="I've tried many task management tools, but this is by far the most intelligent and user-friendly."
                author="Emily Johnson"
                title="Entrepreneur"
              />
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price="$9.99"
                features={["AI Task Suggestions", "Smart Scheduling", "Basic Analytics", "Email Support"]}
              />
              <PricingCard
                title="Pro"
                price="$19.99"
                features={["All Basic Features", "Advanced Analytics", "Team Collaboration", "Priority Support"]}
                highlighted={true}
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                features={["All Pro Features", "Custom AI Training", "API Access", "Dedicated Account Manager"]}
              />
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Boost Your Productivity?</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Join thousands of satisfied users and start managing your tasks more efficiently today.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/dashboard">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FAQItem
                question="How does the AI task suggestion work?"
                answer="Our AI analyzes your work patterns, priorities, and deadlines to suggest the most relevant tasks for you to focus on."
              />
              <FAQItem
                question="Can I integrate this with my existing tools?"
                answer="Yes, we offer integrations with popular productivity tools and calendar applications."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Absolutely. We use industry-standard encryption and security measures to protect your data."
              />
              <FAQItem
                question="Do you offer a free trial?"
                answer="Yes, we offer a 14-day free trial for all new users to test out our features."
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 AI Task Manager. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({ quote, author, title }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-gray-500 dark:text-gray-400 mb-4">"{quote}"</p>
      <p className="font-bold">{author}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </motion.div>
  )
}

function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <motion.div
      className={`flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${
        highlighted ? "ring-2 ring-primary" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-6">{price}</p>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="mt-auto" variant={highlighted ? "default" : "outline"}>
        Choose Plan
      </Button>
    </motion.div>
  )
}

function FAQItem({ question, answer }) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold">{question}</h3>
      <p className="text-gray-500 dark:text-gray-400">{answer}</p>
    </motion.div>
  )
}

