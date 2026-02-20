# 📝 Task Manager Application

A modern, full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). Features a beautiful UI with real-time data synchronization, user authentication, and comprehensive task management capabilities.

![Task Manager](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication
- User registration with email validation
- Secure login with JWT tokens
- Protected routes and API endpoints
- Automatic token refresh
- Session management

### 📋 Task Management
- **Create, Read, Update, Delete** tasks
- **Priority levels**: Low, Medium, High
- **Status tracking**: Pending, In Progress, Completed, Archived
- **Due dates** with overdue detection
- **Rich text descriptions**
- **Real-time updates**

### 📊 Dashboard Analytics
- **Statistics Overview**: Total tasks, completion rate, overdue count
- **Task Calendar**: Visual calendar with tasks organized by due date
- **Recent Activity**: Track recently created and modified tasks
- **Reports & Analytics**: Comprehensive charts and metrics
- **Important Tasks**: Quick access to high-priority items
- **Smart Insights**: AI-powered task recommendations

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface with glassmorphism effects
- **Dark Mode Ready**: Supports dark/light themes
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Clear feedback for all operations
- **Error Handling**: User-friendly error messages

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v20.x LTS recommended)
- **MongoDB** (v6.0+) or MongoDB Atlas account
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-manager-application.git
cd task-manager-application
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
MONGO_URI=mongodb://localhost:27017/task-manager
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager

JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
JWT_EXPIRATION=7d
LOG_LEVEL=info
EOL

# Start backend
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api/v1" > .env

# Start frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
task-manager-application/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   └── routes/          # API routes
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── ui/          # UI components
│   │   ├── contexts/        # React contexts
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── dashboard/   # Dashboard pages
│   │   │   └── tasks/       # Task management
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layout components
│   │   ├── lib/             # Utilities
│   │   ├── routes/          # Routing configuration
│   │   └── services/        # API services
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Radix UI** - Accessible components

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin support

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key-min-32-chars
PORT=5000
JWT_EXPIRATION=7d
LOG_LEVEL=info
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    # Register new user
POST   /api/v1/auth/login       # Login user
```

### Tasks (Protected)
```
GET    /api/v1/tasks            # Get all user tasks
GET    /api/v1/tasks/:id        # Get single task
POST   /api/v1/tasks            # Create task
PUT    /api/v1/tasks/:id        # Update task
DELETE /api/v1/tasks/:id        # Delete task
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new account
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Logout
- [ ] Access protected route when not logged in

**Tasks:**
- [ ] Create new task
- [ ] View task list
- [ ] Edit task
- [ ] Delete task
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Search tasks
- [ ] Sort by date/priority

**Dashboard:**
- [ ] View statistics
- [ ] Check calendar view
- [ ] View recent activity
- [ ] Check analytics

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL`
6. Deploy

### Production Checklist
- [ ] Update CORS origins
- [ ] Use production MongoDB URI
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure logging
- [ ] Set up error monitoring

## 📝 Features in Detail

### Task Creation
- Form validation
- Date picker for due dates
- Priority selection (Low/Medium/High)
- Status selection
- Auto-assignment to user

### Dashboard
- **Real-time Statistics**: Task counts, completion rates
- **Calendar View**: Tasks organized by due date
- **Analytics**: Visual charts and trends
- **Quick Actions**: Fast access to create/edit tasks

### Smart Features
- **Overdue Detection**: Automatic flagging of overdue tasks
- **AI Insights**: Smart suggestions based on task data
- **Search**: Fast full-text search across tasks
- **Filters**: Multiple filter combinations
- **Sorting**: By date, priority, or alphabetical

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

**Frontend can't connect to backend:**
- Verify backend is running
- Check VITE_API_BASE_URL in frontend/.env
- Restart frontend after changing .env

**Tasks not showing:**
- Check you're logged in
- Verify JWT token in localStorage
- Check browser console for errors
- Check backend terminal for errors

**401 Unauthorized errors:**
- Logout and login again
- Clear browser cache
- Check JWT_SECRET matches between sessions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sanjay Kumar**
- Email: sanjay17126@gmail.com
- GitHub: [@snjy-kumar](https://github.com/snjy-kumar)

## 🙏 Acknowledgments

- React team for the amazing library
- TailwindCSS for the styling framework
- MongoDB team for the excellent database
- All open-source contributors

## 📞 Support

For support, email sanjay17126@gmail.com or create an issue in the GitHub repository.

---

**Made with ❤️ by Sanjay Kumar**

## Backend branch demo note

This line was added on the backend branch to demonstrate separate branch development.
