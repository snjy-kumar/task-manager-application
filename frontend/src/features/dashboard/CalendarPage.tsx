import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const events = [
  { id: 1, title: 'Team Meeting', time: '10:00 AM - 11:00 AM', location: 'Conference Room A', attendees: 5, type: 'meeting' },
  { id: 2, title: 'Project Deadline', time: '5:00 PM', location: 'Online', attendees: 0, type: 'deadline' },
  { id: 3, title: 'Client Call', time: '2:30 PM - 3:30 PM', location: 'Zoom', attendees: 3, type: 'call' },
  { id: 4, title: 'Review Presentation', time: '4:00 PM - 4:30 PM', location: 'Office', attendees: 2, type: 'task' },
  { id: 5, title: 'Submit Weekly Report', time: '11:00 AM', location: 'Email', attendees: 0, type: 'task' },
];

// Demo data for visualization
const generateCalendarData = (inputDate) => {
  const currentYear = inputDate.getFullYear();
  const currentMonth = inputDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null); // Empty cells for days from previous month
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return {
    currentYear,
    currentMonth,
    daysInMonth,
    firstDayOfMonth,
    calendarDays
  };
};

function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [viewMode, setViewMode] = useState('month');
  
  const { currentYear, currentMonth, calendarDays } = generateCalendarData(currentDate);
  
  // Previous and next month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a day has events
  const getDayEvents = (day: number) => {
    // For demo purposes, we'll just return events on certain days
    if (day % 5 === 0) return events.slice(0, 3);
    if (day % 3 === 0) return events.slice(0, 1);
    if (day % 2 === 0) return events.slice(0, 2);
    return [];
  };
  
  // Get event for current day
  const todayEvents = getDayEvents(today.getDate());
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your schedule and events</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'month' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'week' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'day' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
          </div>
          <Button asChild>
            <Link to="/dashboard/calendar/new">
              <Plus className="h-4 w-4 mr-1" /> New Event
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(today)}
            className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md"
          >
            Today
          </button>
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
          {DAYS.map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Dates */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`border border-gray-100 dark:border-gray-700 p-1 min-h-[100px] ${
                day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium inline-block h-6 w-6 text-center rounded-full ${
                      day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                        ? 'bg-primary text-white'
                        : ''
                    }`}>
                      {day}
                    </span>
                    {getDayEvents(day).length > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                        {getDayEvents(day).length}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    {getDayEvents(day).slice(0, 2).map((event) => (
                      <div 
                        key={event.id} 
                        className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                      >
                        {event.title}
                      </div>
                    ))}
                    {getDayEvents(day).length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{getDayEvents(day).length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <BentoGrid cols={3} gap="md">
        <BentoCard
          title="Today's Events"
          icon={<CalendarIcon className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="space-y-3 mt-2">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                <p>No events scheduled for today</p>
              </div>
            )}
          </div>
        </BentoCard>
        
        <BentoCard
          title="Upcoming Deadlines"
          icon={<AlertCircle className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-2 mt-2">
            {events.filter(e => e.type === 'deadline').map((event) => (
              <div key={event.id} className="flex items-start p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-1 bg-red-100 text-red-600 rounded mr-2">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
        
        <BentoCard
          title="Completed Events"
          icon={<CheckCircle className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-2 mt-2">
            <div className="flex items-start p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-1 bg-green-100 text-green-600 rounded mr-2">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium line-through text-gray-500">Weekly Planning</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>9:00 AM - 10:00 AM</span>
                </div>
              </div>
            </div>
            <div className="flex items-start p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-1 bg-green-100 text-green-600 rounded mr-2">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium line-through text-gray-500">Design Review</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Yesterday, 2:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

interface EventItemProps {
  event: {
    id: number;
    title: string;
    time: string;
    location: string;
    attendees: number;
    type: string;
  };
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'deadline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-600';
      case 'call':
        return 'bg-green-100 text-green-600';
      case 'deadline':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };
  
  return (
    <div className="flex items-start p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className={`p-1 ${getEventColor(event.type)} rounded mr-2`}>
        {getEventIcon(event.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        <div className="flex flex-col space-y-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{event.location}</span>
            </div>
          )}
          {event.attendees > 0 && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
