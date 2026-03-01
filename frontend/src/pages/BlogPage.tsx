import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  Tag,
  ChevronRight,
  ArrowRight,
  Calendar,
  User,
  Bookmark,
  X,
} from 'lucide-react';


/* ─── Design tokens ─────────────────────────────────────────────── */
const BG = 'hsl(222,25%,7%)';
const CARD = 'hsl(222,25%,10%)';
const BORDER = 'rgba(255,255,255,0.08)';

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1" style={{ background: BG }}>

      {/* Hero */}
      <section className="relative w-full py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-[0.05]"
            style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 65%)' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 mb-6"
          >
            <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">Blog & Insights</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.07] tracking-tight mb-5"
          >
            Productivity tips &
            <br />
            <span className="text-amber-400">AI insights.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg mb-8 max-w-xl mx-auto"
          >
            Thought leadership, how-to guides, and product updates from our team.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center max-w-xl mx-auto rounded-xl border px-4 py-1"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <Search className="w-4 h-4 text-white/40 shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="w-full py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">Featured</span>
            <div className="h-px flex-1" style={{ background: BORDER }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main feature */}
            <div className="lg:col-span-2">
              {featuredPost && (
                <motion.div
                  className="group relative rounded-2xl overflow-hidden border h-full min-h-[420px]"
                  style={{ borderColor: BORDER }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.95) 0%, rgba(10,12,18,0.4) 60%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {featuredPost.categories.map((cat, i) => (
                        <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {getCategoryName(cat)}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{featuredPost.title}</h3>
                    <div className="flex items-center gap-3 text-white/50 text-sm mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featuredPost.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featuredPost.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featuredPost.readTime}</span>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
                    >
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Secondary featured */}
            <div className="space-y-4">
              {secondaryFeaturedPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className="group rounded-2xl overflow-hidden border flex gap-0 h-36"
                  style={{ background: CARD, borderColor: BORDER }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-32 shrink-0 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center p-4 min-w-0">
                    <span className="text-xs text-white/40 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{post.date}
                    </span>
                    <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2">{post.title}</h3>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">
                      Read <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6"><div className="h-px" style={{ background: BORDER }} /></div>

      {/* Main content */}
      <section className="w-full py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className="w-full lg:w-64 shrink-0 lg:order-2">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BORDER }}>
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-4">Categories</h2>
                  <ul className="space-y-1">
                    <li>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${activeCategory === 'all'
                            ? 'bg-amber-500/15 text-amber-400 font-semibold'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        onClick={() => setActiveCategory('all')}
                      >
                        <span>All Topics</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${activeCategory === 'all' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/8 text-white/40'}`}>
                          {blogPosts.length}
                        </span>
                      </button>
                    </li>
                    {blogCategories.map((category) => {
                      const count = blogPosts.filter(p => p.categories.includes(category.id)).length;
                      return (
                        <li key={category.id}>
                          <button
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${activeCategory === category.id
                                ? 'bg-amber-500/15 text-amber-400 font-semibold'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                            onClick={() => setActiveCategory(category.id)}
                          >
                            <span>{category.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${activeCategory === category.id ? 'bg-amber-500/20 text-amber-400' : 'bg-white/8 text-white/40'}`}>
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Tags */}
                <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BORDER }}>
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-4">Popular Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {blogTags.map((tag) => (
                      <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/5 border text-white/50 hover:text-white hover:border-amber-500/30 cursor-pointer transition-colors" style={{ borderColor: BORDER }}>
                        <Tag className="w-2.5 h-2.5" />{tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="rounded-2xl border p-5" style={{ background: 'hsl(222,25%,11%)', borderColor: 'rgba(245,166,35,0.15)' }}>
                  <h3 className="text-sm font-semibold text-white mb-1">Newsletter</h3>
                  <p className="text-xs text-white/45 mb-4">Get the latest articles straight to your inbox.</p>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors mb-2"
                    style={{ borderColor: BORDER }}
                  />
                  <button className="w-full h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>

            {/* Article grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {activeCategory === 'all' ? 'Latest Articles' : getCategoryName(activeCategory)}
                </h2>
                <span className="text-sm text-white/40">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="rounded-2xl border p-12 text-center" style={{ background: CARD, borderColor: BORDER }}>
                  <p className="text-white/40 mb-4">No articles match your search.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/15 text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredPosts.map((post, index) => (
                    <BlogPostCard key={post.id} post={post} delay={index * 0.07} />
                  ))}
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="mt-10 flex justify-center">
                  <button className="inline-flex items-center gap-2 h-10 px-6 rounded-xl border text-white/60 hover:text-white hover:border-white/30 text-sm font-medium transition-colors" style={{ borderColor: BORDER }}>
                    Load more articles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter banner */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center border"
            style={{ background: 'hsl(222,25%,11%)', borderColor: 'rgba(245,166,35,0.15)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 opacity-[0.07]"
              style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 70%)' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the loop</h2>
              <p className="text-white/50 max-w-lg mx-auto mb-8">
                Get productivity tips, AI news, and product updates delivered to your inbox. No spam, ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                  style={{ borderColor: BORDER }}
                />
                <button className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors shrink-0">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/30">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};


interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  categories: string[];
  tags: string[];
}

interface BlogPostCardProps {
  post: BlogPost;
  delay?: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, delay = 0 }) => {
  return (
    <motion.div
      className="group rounded-2xl overflow-hidden border flex flex-col h-full"
      style={{ background: CARD, borderColor: BORDER }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
    >
      <div className="relative overflow-hidden h-44">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,12,18,0.5) 0%, transparent 60%)' }} />
        <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
          <Bookmark className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-white/35 text-xs mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
        </div>

        <h3 className="text-base font-semibold text-white leading-snug mb-2 line-clamp-2">{post.title}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.categories.slice(0, 2).map((cat, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {getCategoryName(cat)}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/45 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>

        <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
            <span className="text-xs text-white/55 font-medium">{post.author}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">
            Read <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const getCategoryName = (categoryId: string): string => {
  const category = blogCategories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Uncategorized';
};

const blogCategories = [
  { id: 'productivity', name: 'Productivity' },
  { id: 'ai', name: 'AI & Machine Learning' },
  { id: 'tips', name: 'Tips & Tricks' },
  { id: 'updates', name: 'Product Updates' },
  { id: 'case-studies', name: 'Case Studies' },
];

const blogTags = [
  { id: 'time-management', name: 'Time Management' },
  { id: 'automation', name: 'Automation' },
  { id: 'workflow', name: 'Workflow' },
  { id: 'focus', name: 'Focus' },
  { id: 'ai-trends', name: 'AI Trends' },
  { id: 'productivity-apps', name: 'Productivity Apps' },
  { id: 'remote-work', name: 'Remote Work' },
  { id: 'team-collaboration', name: 'Team Collaboration' },
];

const featuredPost: BlogPost = {
  id: '1',
  title: 'How AI is Revolutionizing Task Management in 2024',
  slug: 'how-ai-revolutionizing-task-management-2024',
  excerpt: 'Discover how artificial intelligence is transforming the way we manage tasks and improve productivity in the modern workplace.',
  content: '(Full article content)',
  image: 'https://placehold.co/800x600/2563eb/FFFFFF/png?text=AI+Task+Management',
  date: 'May 15, 2024',
  author: 'Alex Johnson',
  authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=AJ',
  readTime: '8 min read',
  categories: ['ai', 'productivity'],
  tags: ['ai-trends', 'workflow', 'automation'],
};

const secondaryFeaturedPosts: BlogPost[] = [
  {
    id: '2',
    title: '10 Productivity Hacks Using AI Task Manager',
    slug: '10-productivity-hacks-using-ai-task-manager',
    excerpt: 'Learn how to supercharge your productivity with these advanced tips for AI Task Manager.',
    content: '(Full article content)',
    image: 'https://placehold.co/400x300/2563eb/FFFFFF/png?text=Productivity+Hacks',
    date: 'May 10, 2024',
    author: 'Sarah Chen',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=SC',
    readTime: '5 min read',
    categories: ['tips', 'productivity'],
    tags: ['time-management', 'focus'],
  },
  {
    id: '3',
    title: 'Case Study: How Company X Increased Efficiency by 40%',
    slug: 'case-study-company-x-increased-efficiency',
    excerpt: 'See how a leading tech company transformed their workflow using AI Task Manager.',
    content: '(Full article content)',
    image: 'https://placehold.co/400x300/2563eb/FFFFFF/png?text=Case+Study',
    date: 'May 5, 2024',
    author: 'Michael Rodriguez',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=MR',
    readTime: '7 min read',
    categories: ['case-studies'],
    tags: ['team-collaboration', 'workflow'],
  },
];

const blogPosts: BlogPost[] = [
  featuredPost,
  ...secondaryFeaturedPosts,
  {
    id: '4',
    title: 'The Future of Work: AI-Powered Task Management',
    slug: 'future-of-work-ai-powered-task-management',
    excerpt: 'Explore how AI will continue to evolve and shape the future of work and task management.',
    content: '(Full article content)',
    image: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Future+of+Work',
    date: 'April 28, 2024',
    author: 'Lisa Martinez',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=LM',
    readTime: '6 min read',
    categories: ['ai', 'productivity'],
    tags: ['ai-trends', 'future-of-work'],
  },
  {
    id: '5',
    title: 'New Feature Release: AI Task Prioritization',
    slug: 'new-feature-release-ai-task-prioritization',
    excerpt: 'Introducing our newest feature that uses AI to automatically prioritize your tasks for maximum efficiency.',
    content: '(Full article content)',
    image: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=New+Feature',
    date: 'April 20, 2024',
    author: 'David Park',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=DP',
    readTime: '4 min read',
    categories: ['updates', 'ai'],
    tags: ['product-updates', 'automation'],
  },
  {
    id: '6',
    title: '5 Ways to Optimize Your Remote Team\'s Workflow',
    slug: '5-ways-optimize-remote-teams-workflow',
    excerpt: 'Learn strategies to improve collaboration and productivity when managing remote teams.',
    content: '(Full article content)',
    image: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Remote+Work',
    date: 'April 15, 2024',
    author: 'Emily Wong',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=EW',
    readTime: '5 min read',
    categories: ['tips', 'productivity'],
    tags: ['remote-work', 'team-collaboration'],
  },
  {
    id: '7',
    title: 'Understanding Machine Learning in Task Management',
    slug: 'understanding-machine-learning-task-management',
    excerpt: 'A deep dive into how machine learning algorithms power modern task management solutions.',
    content: '(Full article content)',
    image: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Machine+Learning',
    date: 'April 8, 2024',
    author: 'Alex Johnson',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=AJ',
    readTime: '9 min read',
    categories: ['ai'],
    tags: ['ai-trends', 'machine-learning'],
  },
  {
    id: '8',
    title: 'How to Integrate AI Task Manager with Your Favorite Tools',
    slug: 'how-to-integrate-ai-task-manager-favorite-tools',
    excerpt: 'A step-by-step guide to connecting AI Task Manager with other productivity tools for a seamless workflow.',
    content: '(Full article content)',
    image: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Integration+Guide',
    date: 'April 1, 2024',
    author: 'Sarah Chen',
    authorAvatar: 'https://placehold.co/100/2563eb/FFFFFF/png?text=SC',
    readTime: '6 min read',
    categories: ['tips', 'updates'],
    tags: ['integrations', 'productivity-apps'],
  },
];

export default BlogPage; 