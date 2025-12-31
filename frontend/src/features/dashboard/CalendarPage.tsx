import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import taskService, { Task } from '@/services/taskService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarData {
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  calendarDays: (number | null)[];
}

const generateCalendarData = (inputDate: Date): CalendarData => {
  const currentYear = inputDate.getFullYear();
  const currentMonth = inputDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { currentYear, currentMonth, calendarDays } = generateCalendarData(currentDate);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      setTasks(response.tasks || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDayTasks = (day: number): Task[] => {
    if (!day) return [];

    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentMonth &&
        taskDate.getFullYear() === currentYear
      );
    });
  };

  const getSelectedDayTasks = (): Task[] => {
    if (!selectedDay) return [];
    return getDayTasks(selectedDay);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">View tasks organized by due date</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" onClick={fetchTasks} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-1" /> New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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
              className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20"
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
          <div className="grid grid-cols-7 min-h-[500px]">
            {calendarDays.map((day, index) => {
              const dayTasks = day ? getDayTasks(day) : [];
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <div
                  key={index}
                  className={`border border-gray-100 dark:border-gray-700 p-2 min-h-[80px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => day && setSelectedDay(day)}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium inline-flex items-center justify-center h-6 w-6 rounded-full ${isToday ? 'bg-primary text-white' : ''
                          }`}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-white">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task._id}
                            className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold mb-4">
            {selectedDay
              ? `Tasks for ${MONTHS[currentMonth]} ${selectedDay}`
              : 'Select a day'}
          </h3>

          <div className="space-y-3">
            {selectedDay ? (
              getSelectedDayTasks().length > 0 ? (
                getSelectedDayTasks().map((task) => (
                  <Link
                    key={task._id}
                    to={`/dashboard/tasks/${task._id}/edit`}
                    className="block"
                  >
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">{task.title}</p>
                        <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)} mt-1.5`}></span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">{task.priority}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No tasks on this day</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click on a day to view tasks</p>
              </div>
            )}
          </div>

          {selectedDay && getSelectedDayTasks().length > 0 && (
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/dashboard/tasks">
                View All Tasks
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
