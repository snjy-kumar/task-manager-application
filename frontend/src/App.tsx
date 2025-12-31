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
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import DashboardHome from './features/dashboard/DashboardHome'
import TaskList from './features/tasks/TaskList'
import TaskForm from './features/tasks/TaskForm'
import KanbanBoard from './features/tasks/KanbanBoard'
import CalendarView from './features/tasks/CalendarView'
import CalendarPage from './features/dashboard/CalendarPage'
import ReportsPage from './features/dashboard/ReportsPage'
import StarredPage from './features/dashboard/StarredPage'
import RecentlyViewedPage from './features/dashboard/RecentlyViewedPage'
import ProfilePage from './features/dashboard/ProfilePage'
import SettingsPage from './features/dashboard/SettingsPage'
import PersonalTasksPage from './features/projects/PersonalTasksPage'
import WorkPage from './features/projects/WorkPage'
import ShoppingListPage from './features/projects/ShoppingListPage'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
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

                {/* Dashboard/Authenticated Pages - All Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardHome /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/tasks" element={<ProtectedRoute><DashboardLayout><TaskList /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/tasks/new" element={<ProtectedRoute><DashboardLayout><TaskForm /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/tasks/:id/edit" element={<ProtectedRoute><DashboardLayout><TaskForm editMode={true} /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/kanban" element={<ProtectedRoute><DashboardLayout><KanbanBoard /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/calendar-view" element={<ProtectedRoute><DashboardLayout><CalendarView /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/calendar" element={<ProtectedRoute><DashboardLayout><CalendarPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/starred" element={<ProtectedRoute><DashboardLayout><StarredPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/recent" element={<ProtectedRoute><DashboardLayout><RecentlyViewedPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/projects/personal" element={<ProtectedRoute><DashboardLayout><PersonalTasksPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/projects/work" element={<ProtectedRoute><DashboardLayout><WorkPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/projects/shopping" element={<ProtectedRoute><DashboardLayout><ShoppingListPage /></DashboardLayout></ProtectedRoute>} />

                <Route path="/home" element={<Home />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
