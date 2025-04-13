import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Award, 
  Target,
  Users,
  Heart,
  Lightbulb,
  Clock,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About AI Task Manager
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We're on a mission to revolutionize productivity with the power of artificial intelligence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2022, AI Task Manager began with a simple idea: what if AI could help us manage our tasks more effectively?
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Our founders, a team of AI researchers and productivity enthusiasts, were frustrated with existing task management solutions that lacked intelligence and adaptability. They set out to create a platform that could not only organize tasks but actively help users prioritize and optimize their workflow.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Today, AI Task Manager is used by thousands of individuals and teams worldwide, helping them achieve more with less stress and better focus.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://placehold.co/600x400/2563eb/FFFFFF/png?text=Our+Office" 
                  alt="Our Office" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-30" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're guided by a set of core principles that influence everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Target className="h-10 w-10 text-primary" />}
              title="Mission"
              description="To empower individuals and teams to achieve peak productivity through intelligent task management."
            />
            <ValueCard
              icon={<Lightbulb className="h-10 w-10 text-primary" />}
              title="Innovation"
              description="We constantly push the boundaries of what AI can do to make task management smarter and more intuitive."
            />
            <ValueCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="User-Centered"
              description="Every feature we build starts with understanding the real needs of our users."
            />
            <ValueCard
              icon={<Heart className="h-10 w-10 text-primary" />}
              title="Passion"
              description="We're passionate about productivity and helping people achieve their goals with less stress."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-blue-600 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="20K+" label="Happy Users" />
            <StatCard number="35+" label="Team Members" />
            <StatCard number="12M+" label="Tasks Completed" />
            <StatCard number="98%" label="Customer Satisfaction" />
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The talented people behind AI Task Manager who are dedicated to making productivity easier for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMemberCard
              name="Alex Johnson"
              role="Co-Founder & CEO"
              bio="Alex has over 15 years of experience in AI and machine learning. Prior to founding AI Task Manager, he led AI research teams at top tech companies."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=AJ"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
            <TeamMemberCard
              name="Sarah Chen"
              role="Co-Founder & CTO"
              bio="Sarah is an expert in AI algorithms and productivity systems. She holds a Ph.D. in Computer Science from MIT and has published numerous papers on AI."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=SC"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
            <TeamMemberCard
              name="Michael Rodriguez"
              role="Head of Product"
              bio="Michael brings a decade of experience in product management from leading tech companies. He's passionate about creating intuitive user experiences."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=MR"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
            <TeamMemberCard
              name="Emily Wong"
              role="Head of Design"
              bio="Emily is an award-winning designer with a focus on creating beautiful, functional interfaces that make complex tasks feel simple."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=EW"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
            <TeamMemberCard
              name="David Park"
              role="VP of Engineering"
              bio="David leads our engineering team with his extensive experience building scalable, reliable software systems at major tech companies."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=DP"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
            <TeamMemberCard
              name="Lisa Martinez"
              role="VP of Customer Success"
              bio="Lisa ensures our customers get the most value from our platform. She's dedicated to understanding user needs and providing exceptional support."
              image="https://placehold.co/300x300/2563eb/FFFFFF/png?text=LM"
              social={{
                twitter: "#",
                linkedin: "#"
              }}
            />
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link to="/careers">
                Join Our Team <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From an idea to the leading AI-powered task management platform.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-12">
              <TimelineItem
                year="2022"
                title="The Beginning"
                description="AI Task Manager was founded by Alex Johnson and Sarah Chen with a vision to reimagine productivity tools."
                isLeft={true}
              />
              <TimelineItem
                year="2022"
                title="First MVP"
                description="Launched our first minimum viable product with basic AI task prioritization features."
                isLeft={false}
              />
              <TimelineItem
                year="2023"
                title="Seed Funding"
                description="Secured $2.5 million in seed funding to expand our team and develop more advanced AI capabilities."
                isLeft={true}
              />
              <TimelineItem
                year="2023"
                title="Team Growth"
                description="Expanded our team to 15 talented individuals across engineering, design, and customer success."
                isLeft={false}
              />
              <TimelineItem
                year="2024"
                title="Series A"
                description="Raised $12 million in Series A funding to accelerate growth and launch enterprise features."
                isLeft={true}
              />
              <TimelineItem
                year="2024"
                title="Global Expansion"
                description="Expanded our user base to over 20,000 customers across 30+ countries worldwide."
                isLeft={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-primary text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us on Our Mission</h2>
            <p className="text-xl mb-8 text-white/80">
              Experience the future of productivity with AI Task Manager. Start your journey today.
            </p>
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-4xl font-bold mb-2">{number}</p>
      <p className="text-lg text-blue-100">{label}</p>
    </motion.div>
  );
};

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, bio, image, social }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-primary font-medium mb-3">{role}</p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{bio}</p>
        <div className="flex space-x-3">
          {social.twitter && (
            <a href={social.twitter} className="text-gray-400 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} className="text-gray-400 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}
          {social.website && (
            <a href={social.website} className="text-gray-400 hover:text-primary transition-colors">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, isLeft }) => {
  return (
    <div className="relative z-10">
      <div className={`flex items-center justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-5/12">
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-bold text-primary block mb-2">{year}</span>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </motion.div>
        </div>
        <div className="z-10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary" />
        </div>
        <div className="w-5/12" /> {/* Empty space for alignment */}
      </div>
    </div>
  );
};

export default AboutPage; 