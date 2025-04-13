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
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter blog posts based on search query and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || post.categories.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });
  
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
              AI Task Manager Blog
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Productivity tips, AI insights, and updates from our team.
            </motion.p>
            
            <motion.div
              className="bg-white/10 p-2 rounded-full flex items-center max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="h-5 w-5 ml-3 text-white" />
              <input
                type="text"
                placeholder="Search articles..."
                className="bg-transparent border-none flex-1 p-2 text-white placeholder-blue-100 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="mr-3 text-blue-100 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feature */}
            <div className="lg:col-span-2">
              {featuredPost && (
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-300" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <div className="flex items-center text-white text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{featuredPost.date}</span>
                        <span className="mx-2">•</span>
                        <User className="h-4 w-4 mr-1" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{featuredPost.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.categories.map((category, index) => (
                        <span 
                          key={index} 
                          className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                          onClick={() => setActiveCategory(category)}
                        >
                          {getCategoryName(category)}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
                    <Button asChild>
                      <Link to={`/blog/${featuredPost.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Secondary Features */}
            <div className="space-y-6">
              {secondaryFeaturedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="sm:w-1/3 h-40 sm:h-auto">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-4 sm:p-6 sm:w-2/3">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <span 
                          key={index} 
                          className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                          onClick={() => setActiveCategory(category)}
                        >
                          {getCategoryName(category)}
                        </span>
                      ))}
                    </div>
                    <Link to={`/blog/${post.slug}`} className="text-primary font-medium hover:underline inline-flex items-center">
                      Read Article <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="w-full lg:w-1/4 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                        activeCategory === 'all' 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveCategory('all')}
                    >
                      <span className="mr-2">All Topics</span>
                      <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                        {blogPosts.length}
                      </span>
                    </button>
                  </li>
                  {blogCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                          activeCategory === category.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                          {blogPosts.filter(post => post.categories.includes(category.id)).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {blogTags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h3 className="font-bold mb-2">Subscribe to our newsletter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get the latest articles and resources straight to your inbox.</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                    />
                    <Button type="button" size="sm">Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Post Cards */}
            <div className="w-full lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeCategory === 'all' 
                    ? 'Latest Articles' 
                    : `Articles in ${getCategoryName(activeCategory)}`}
                </h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No articles found matching your criteria.</p>
                  <Button onClick={() => {setSearchQuery(''); setActiveCategory('all');}}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, index) => (
                    <BlogPostCard 
                      key={post.id} 
                      post={post} 
                      delay={index * 0.1} 
                    />
                  ))}
                </div>
              )}
              
              {filteredPosts.length > 0 && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline">Load More Articles</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="w-full py-16 bg-primary text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Newsletter</h2>
            <p className="text-xl mb-8 text-white/80">
              Get the latest productivity tips, AI news, and exclusive updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Button className="bg-white text-primary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
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
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Bookmark className="h-5 w-5 text-white bg-black/20 p-1 rounded-full" />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.readTime}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 flex-grow-0">{post.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories.slice(0, 2).map((category, index) => (
            <span 
              key={index} 
              className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {getCategoryName(category)}
            </span>
          ))}
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-4 flex-grow">{post.excerpt}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img 
              src={post.authorAvatar} 
              alt={post.author} 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span className="text-sm font-medium">{post.author}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="text-primary font-medium hover:underline">
            Read
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

// Sample data
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