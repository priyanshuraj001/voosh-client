import React, { useState, useContext } from 'react';
import axios from '../services/api';
import { LoaderContext } from '../context/LoaderContext';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [message, setMessage] = useState('');
  const { setLoading } = useContext(LoaderContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/tasks', { title, description, status });
      onTaskCreated(response.data); 
      setMessage({ text: 'Task created successfully!', type: 'success' });
      setTitle('');
      setDescription('');
      setStatus('todo');
    } catch (error) {
      setMessage({ text: 'Error creating task. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
