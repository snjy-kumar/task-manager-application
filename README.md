# AI Task Manager Application

A modern task management application powered by AI, with a sleek UI featuring bento grid layouts.

## Features

- **Modern Bento Grid Layout**: Eye-catching, modular design for both marketing pages and dashboard
- **AI-Powered Task Management**: Get intelligent task suggestions based on your patterns
- **Responsive Design**: Works beautifully on all devices (mobile, tablet, desktop)
- **Dark/Light Mode**: Easily switch between themes for comfortable viewing
- **Interactive Components**: Motion animations and engaging UI elements

## Key Components

### BentoCard and BentoGrid

The application features a flexible bento grid system with various component sizes:

- **BentoCard**: Modular card component with customizable sizes, gradients, and hover effects
- **BentoGrid**: Container component for organizing BentoCards in responsive layouts
- **BentoShowcase**: Pre-built showcase components demonstrating different bento grid layouts

### Animations

- Custom hooks for consistent animations across the application
- Support for staggered animations and scroll-triggered effects
- Smooth transitions between states and pages

## Pages

### Marketing Pages

- **Landing Page**: Modern bento grid layout showcasing key features and benefits
- **Features Page**: Detailed breakdown of application capabilities
- **Pricing Page**: Clear pricing tiers with feature comparison
- **About Page**: Company story and team information
- **Contact Page**: Get in touch with the team
- **Blog Page**: Articles and updates
- **FAQ Page**: Common questions and answers

### Dashboard

- **Dashboard Home**: Overview of tasks, productivity metrics, and AI suggestions
- **Task List**: Comprehensive task management interface
- **Task Form**: Create and edit tasks with detailed properties

## Technical Improvements

1. **Code Organization**:
   - Created reusable components to reduce duplication
   - Implemented consistent styling patterns across the application
   - Added proper type definitions for all components

2. **Performance Optimizations**:
   - Reduced component re-renders
   - Improved loading times with optimized assets
   - Implemented code-splitting for better performance

3. **UX Enhancements**:
   - Added intuitive navigation patterns
   - Implemented responsive designs for all screen sizes
   - Enhanced visual feedback for user interactions

## Getting Started

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd task-manager-application

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=your-api-url
VITE_AUTH_DOMAIN=your-auth-domain
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **State Management**: React Context API
- **Routing**: React Router
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Build Tool**: Vite

## License

This project is licensed under the MIT License - see the LICENSE file for details.

