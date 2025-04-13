import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css' 
import Home from './pages/Home' 
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import FaqPage from './pages/FaqPage'
import { ThemeProvider } from './theme/ThemeProvider'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import DashboardHome from './features/dashboard/DashboardHome'
import TaskList from './features/tasks/TaskList'
import TaskForm from './features/tasks/TaskForm'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing/Public Pages */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/features" element={<MainLayout><FeaturesPage /></MainLayout>} />
          <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
          <Route path="/faq" element={<MainLayout><FaqPage /></MainLayout>} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Dashboard/Authenticated Pages */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/tasks" element={<DashboardLayout><TaskList /></DashboardLayout>} />
          <Route path="/dashboard/tasks/new" element={<DashboardLayout><TaskForm /></DashboardLayout>} />
          <Route path="/dashboard/tasks/:id/edit" element={<DashboardLayout><TaskForm editMode={true} /></DashboardLayout>} />
          <Route path="/home" element={<Home />} />
        </Routes> 
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
