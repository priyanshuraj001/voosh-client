import React, { useState, useEffect, useContext } from 'react';
import axios from '../services/api';
import { LoaderContext } from '../context/LoaderContext';

const TaskList = ({ tasks, onEdit, onDelete, onView }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [status, setStatus] = useState('');
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        await axios.get('/tasks', { params: { search, sort, status } });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [search, sort, status, setLoading]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status ? task.status === status : true;
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`/tasks/${taskId}`);
      onDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="recent">Sort by Recent</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {sortedTasks.map((task) => (
        <div key={task._id} className="p-4 mb-4 bg-gray-100 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold truncate">
              {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
              </h3>
            <p className="text-sm text-gray-600">
              {task.description.length > 20 ? task.description.substring(0, 20) + '...' : task.description}
            </p>
            <p className="text-sm text-gray-600">Status: {task.status}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onView(task)} className="bg-blue-500 text-white px-2 py-1 rounded">View</button>
            <button onClick={() => onEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
