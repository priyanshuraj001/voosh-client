import React, { useState, useEffect, useContext } from 'react';
import axios from '../services/api';
import { LoaderContext } from '../context/LoaderContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Loader from '../components/Loader';
import TaskDetailModal from '../components/TaskDetails';
import TaskEditModal from '../components/TaskEdit';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { loading, setLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [setLoading]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setIsEditing(false);
    setShowDialog(true);
  };

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
  };

  return (
    <div className="relative">
      {loading && <Loader />}
      <TaskForm onTaskCreated={(newTask) => setTasks([...tasks, newTask])} />
      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      {showDialog && selectedTask && (
        isEditing ? (
          <TaskEditModal
            task={selectedTask}
            onClose={() => setShowDialog(false)}
            onTaskUpdated={handleTaskUpdated}
          />
        ) : (
          <TaskDetailModal 
            task={selectedTask}
            onClose={() => setShowDialog(false)}
          />
        )
      )}
    </div>
  );
};

export default TaskPage;
