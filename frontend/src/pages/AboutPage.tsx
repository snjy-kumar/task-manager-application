import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Users,
  Heart,
  Lightbulb,
  Twitter,
  Linkedin,
  Globe,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────────────────── */
const BG = 'hsl(222,25%,7%)';
const CARD = 'hsl(222,25%,10%)';
const CARD_RAISED = 'hsl(222,25%,12%)';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_AMBER = 'rgba(245,166,35,0.18)';

/* ─── Data ──────────────────────────────────────────────────────── */
const stats = [
  { value: '50K+', label: 'Active users' },
  { value: '12M+', label: 'Tasks completed' },
  { value: '35+', label: 'Team members' },
  { value: '98%', label: 'Satisfaction rate' },
];

const values = [
  {
    icon: Target,
    title: 'Mission',
    description: 'Empower individuals and teams to achieve peak productivity through intelligent, AI-driven task management.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly push the boundaries of what AI can do to make task management smarter and more intuitive.',
  },
  {
    icon: Users,
    title: 'User-centered',
    description: 'Every feature starts with a deep understanding of real user needs — not assumptions.',
  },
  {
    icon: Heart,
    title: 'Craft',
    description: "We care obsessively about quality. Every pixel, every interaction, every response time matters to us.",
  },
];

const team = [
  {
    name: 'Alex Johnson',
    role: 'Co-Founder & CEO',
    bio: '15+ years in AI and machine learning. Led AI research teams at top tech companies before founding this platform.',
    initials: 'AJ',
    color: 'from-amber-500 to-orange-600',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & CTO',
    bio: 'PhD in Computer Science from MIT. Expert in AI algorithms and productivity systems with dozens of publications.',
    initials: 'SC',
    color: 'from-violet-500 to-purple-600',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Product',
    bio: 'A decade of product management at leading tech companies. Passionate about intuitive, delightful user experiences.',
    initials: 'MR',
    color: 'from-emerald-500 to-teal-600',
    social: { linkedin: '#' },
  },
  {
    name: 'Emily Wong',
    role: 'Head of Design',
    bio: 'Award-winning designer focused on creating beautiful, functional interfaces that make complex tasks feel simple.',
    initials: 'EW',
    color: 'from-pink-500 to-rose-600',
    social: { twitter: '#', linkedin: '#', website: '#' },
  },
  {
    name: 'David Park',
    role: 'VP of Engineering',
    bio: 'Extensive experience building scalable, reliable systems at hyper-growth companies. Our infrastructure champion.',
    initials: 'DP',
    color: 'from-sky-500 to-blue-600',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: 'Lisa Martinez',
    role: 'VP of Customer Success',
    bio: 'Dedicated to ensuring every customer unlocks the full value of the platform. Feedback → product pipeline owner.',
    initials: 'LM',
    color: 'from-amber-400 to-yellow-500',
    social: { linkedin: '#' },
  },
];

const timeline = [
  { year: '2022', title: 'Founded', description: 'Alex and Sarah started the company with a simple conviction: AI should make work less stressful, not just faster.' },
  { year: '2022', title: 'First MVP', description: 'Shipped the first version with AI task prioritization and got our first 500 users within the month.' },
  { year: '2023', title: '$2.5M Seed', description: 'Secured seed funding to grow the team and deepen our AI capabilities.' },
  { year: '2023', title: 'Team of 15', description: 'Grew to 15 talented people across engineering, design, and customer success.' },
  { year: '2024', title: '$12M Series A', description: 'Raised Series A to accelerate growth and launch enterprise-grade features.' },
  { year: '2025', title: '50K+ users', description: 'Crossed 50,000 active users across 40+ countries with a 98% satisfaction rate.' },
];

/* ─── Sub-components ────────────────────────────────────────────── */
interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index?: number;
}
const ValueCard: React.FC<ValueCardProps> = ({ icon: Icon, title, description, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    className="group rounded-2xl p-6 border transition-all duration-300 hover:border-amber-500/25"
    style={{ background: CARD, borderColor: BORDER }}
  >
    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-amber-400" />
    </div>
    <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-white/50 leading-relaxed">{description}</p>
  </motion.div>
);

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
  social: { twitter?: string; linkedin?: string; website?: string };
  index?: number;
}
const TeamCard: React.FC<TeamCardProps> = ({ name, role, bio, initials, color, social, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.07 }}
    className="group rounded-2xl overflow-hidden border flex flex-col"
    style={{ background: CARD, borderColor: BORDER }}
  >
    {/* Avatar area */}
    <div className={`relative h-36 bg-gradient-to-br ${color} flex items-center justify-center`}>
      <span className="text-4xl font-bold text-white/90">{initials}</span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.12)' }} />
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-base font-semibold text-white mb-0.5">{name}</h3>
      <p className="text-xs font-semibold text-amber-400 mb-3">{role}</p>
      <p className="text-sm text-white/50 leading-relaxed flex-1">{bio}</p>

      <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
        {social.twitter && (
          <a href={social.twitter} className="text-white/30 hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} className="text-white/30 hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {social.website && (
          <a href={social.website} className="text-white/30 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Page ──────────────────────────────────────────────────────── */
const AboutPage: React.FC = () => {
  return (
    <main className="flex-1" style={{ background: BG }}>

      {/* Hero */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 65%)' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">Our story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Built by people who
            <br />
            <span className="text-amber-400">love deep work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            We're a team of AI researchers and productivity obsessives on a mission to make meaningful work feel effortless — not overwhelming.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6"><div className="h-px" style={{ background: BORDER }} /></div>

      {/* Our Story */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-5 block">Our story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                From a frustrating afternoon
                <br />
                to a platform for thousands.
              </h2>
              <div className="space-y-4 text-white/55 leading-relaxed">
                <p>
                  Founded in 2022, Naumin started with a simple conviction: existing tools were treating people like filing cabinets, not humans with fluctuating energy, competing priorities, and real deadlines.
                </p>
                <p>
                  Our founders — a team of AI researchers and productivity enthusiasts — wanted a platform that didn't just store tasks, but actively helped you think through them.
                </p>
                <p>
                  Today, over 50,000 individuals and teams worldwide use our platform to do their best work without burning out.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {[
                  { icon: CheckCircle2, text: 'Founded 2022 in San Francisco' },
                  { icon: TrendingUp, text: 'Growing 3× year over year' },
                  { icon: Award, text: 'Best Productivity App 2025' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-white/50">
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border aspect-[4/3]" style={{ borderColor: BORDER }}>
                {/* Decorative office illustration */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8"
                  style={{ background: 'linear-gradient(135deg, hsl(222,25%,11%) 0%, hsl(222,25%,14%) 100%)' }}>
                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                    {['Design review', 'Sprint plan', 'User research', 'API integration', 'Code review', 'Deploy'].map((t, i) => (
                      <div key={i} className="rounded-lg px-2 py-1.5 text-xs font-medium text-center"
                        style={{
                          background: CARD,
                          borderColor: i % 3 === 0 ? BORDER_AMBER : BORDER,
                          border: '1px solid',
                          color: i % 3 === 0 ? 'rgb(251,191,36)' : 'rgba(255,255,255,0.5)',
                        }}>
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="w-full max-w-xs rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER_AMBER}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">AI Suggestion</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      "Based on your sprint deadline tomorrow, start with API integration now — it blocks 3 other tasks."
                    </p>
                  </div>
                </div>
              </div>
              {/* Glow accents */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-[0.12] blur-3xl"
                style={{ background: '#F5A623' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <div className="w-full border-y" style={{ borderColor: BORDER }}>
        <section className="w-full py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 block">What guides us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mission & values</h2>
              <p className="text-white/50 max-w-xl mx-auto">The principles that influence every decision we make.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => <ValueCard key={v.title} {...v} index={i} />)}
            </div>
          </div>
        </section>
      </div>

      {/* Stats band */}
      <section className="w-full py-14" style={{ background: CARD }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="text-4xl font-bold text-amber-400 mb-1">{s.value}</div>
                <div className="text-sm text-white/45">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 block">The team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet our leadership</h2>
            <p className="text-white/50 max-w-xl mx-auto">The people building the future of productivity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member, i) => <TeamCard key={member.name} {...member} index={i} />)}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border text-white/60 hover:text-white hover:border-white/25 font-semibold text-sm transition-colors"
              style={{ borderColor: BORDER }}
            >
              Join our team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="w-full border-t" style={{ borderColor: BORDER }}>
        <section className="w-full py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 block">The journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How we got here</h2>
              <p className="text-white/50 max-w-xl mx-auto">From a scrappy MVP to a platform trusted by teams worldwide.</p>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,166,35,0.3) 10%, rgba(245,166,35,0.3) 90%, transparent)' }} />

              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={i} className="relative grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
                    {/* Left */}
                    <div className={i % 2 === 0 ? 'flex justify-end' : ''}>
                      {i % 2 === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: i * 0.06 }}
                          className="rounded-2xl p-5 max-w-xs border"
                          style={{ background: CARD_RAISED, borderColor: BORDER }}
                        >
                          <span className="text-xs font-bold text-amber-400 block mb-1">{item.year}</span>
                          <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                          <p className="text-xs text-white/45 leading-relaxed">{item.description}</p>
                        </motion.div>
                      ) : <div />}
                    </div>

                    {/* Center dot */}
                    <div className="relative z-10 w-3 h-3 rounded-full bg-amber-400 ring-4"
                      style={{ boxShadow: '0 0 0 4px hsl(222,25%,7%)' }} />

                    {/* Right */}
                    <div>
                      {i % 2 !== 0 ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: i * 0.06 }}
                          className="rounded-2xl p-5 max-w-xs border"
                          style={{ background: CARD_RAISED, borderColor: BORDER }}
                        >
                          <span className="text-xs font-bold text-amber-400 block mb-1">{item.year}</span>
                          <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                          <p className="text-xs text-white/45 leading-relaxed">{item.description}</p>
                        </motion.div>
                      ) : <div />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center border"
            style={{ background: 'hsl(222,25%,11%)', borderColor: BORDER_AMBER }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 opacity-[0.08]"
              style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 70%)' }} />
            <div className="relative">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-6 block">Join us</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Be part of the mission
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                Experience the future of productivity. Start free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20"
                >
                  Get started free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  View open roles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
