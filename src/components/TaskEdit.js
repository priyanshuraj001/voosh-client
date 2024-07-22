import React, { useState, useContext } from 'react';
import axios from '../services/api';
import { LoaderContext } from '../context/LoaderContext';

const TaskEditModal = ({ task, onClose, onTaskUpdated }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const { setLoading } = useContext(LoaderContext);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedTask = { title, description, status };
      const res = await axios.put(`/tasks/${task._id}`, updatedTask);
      onTaskUpdated(res.data);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="todo">To Do</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
