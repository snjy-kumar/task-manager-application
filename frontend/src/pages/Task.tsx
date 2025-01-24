import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
};

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Omit<Task, "_id">>({
    title: "",
    description: "",
    status: "Pending",
  });

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Task>("/api/tasks", form);
      setTasks([...tasks, response.data]);
      setForm({ title: "", description: "", status: "Pending" }); // Reset form
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update task status
  const updateTaskStatus = async (id: string, status: Task["status"]) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status });
      setTasks(tasks.map((task) => (task._id === id ? { ...task, status } : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Task Management App</h2>

      {/* Add Task Form */}
      <form
        onSubmit={addTask}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, title: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setForm({ ...form, description: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task description"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setForm({ ...form, status: e.target.value as Task["status"] })
            }
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <AiOutlinePlus className="mr-2" />
          Add Task
        </button>
      </form>

      {/* Task List */}
      <h3 className="text-xl font-semibold mb-4">Task List</h3>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white shadow-md rounded p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-lg">{task.title}</h4>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={task.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    updateTaskStatus(task._id, e.target.value as Task["status"])
                  }
                  className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskManagement;
