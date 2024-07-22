import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskDetailModal from '../components/TaskDetails';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        console.log('Fetched tasks:', res.data); // Debugging log
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleDropTask = async (taskId, status) => {
    console.log(taskId, status, 'hii');

    try {
      const res = await axios.put(`/tasks/${taskId}`, { status });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === res.data._id ? res.data : task))
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const onDragEnd = async (result) => {
    console.log(result, 'hii');

    const { destination, source, draggableId } = result;
    console.log('Drag result:', result); // Debugging log

    if (!destination) {
      return;
    }

    const updatedStatus = destination.droppableId;
    if (source.droppableId === updatedStatus) {
      return; // No status change if dropped in the same column
    }

    // Update the UI immediately
    setTasks((prevTasks) => {
      const draggedTask = prevTasks.find((task) => task._id === draggableId);
      if (!draggedTask) return prevTasks;

      // Update the status in the local state
      const updatedTasks = prevTasks.map((task) =>
        task._id === draggableId ? { ...task, status: updatedStatus } : task
      );

      return updatedTasks;
    });

    try {
      await handleDropTask(draggableId, updatedStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const columns = {
    todo: tasks.filter((task) => task.status === 'todo'),
    progress: tasks.filter((task) => task.status === 'progress'),
    done: tasks.filter((task) => task.status === 'done'),
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 p-4 flex flex-col items-center">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto space-x-4 pb-4 w-full max-w-screen-xl">
          {Object.entries(columns).map(([status, tasks]) => (
            <Droppable key={status} droppableId={status} type="task">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-6 rounded-lg shadow-lg w-80 flex-shrink-0"
                >
                  <h2 className="text-2xl font-semibold mb-4 capitalize text-gray-800">{status}</h2>
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => openModal(task)}
                          className="bg-gray-50 p-4 mb-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:shadow-xl cursor-pointer"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{task.title}</h3>
                          <p className="text-gray-700 truncate">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Board;
