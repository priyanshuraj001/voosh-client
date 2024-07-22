import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleDropTask = async (taskId, status) => {
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
    const { destination, source, draggableId } = result;

    if (!destination) {
      console.log('Dropped outside of the droppable area');
      return;
    }

    const updatedStatus = destination.droppableId;
    if (source.droppableId === updatedStatus) {
      console.log('Dropped in the same column');
      return;
    }

    console.log('Draggable ID:', draggableId);
    console.log('Tasks:', tasks);

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: updatedStatus } : task
    );
    setTasks(updatedTasks);

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
        <Droppable droppableId="board" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex overflow-x-auto space-x-4 pb-4 w-full max-w-screen-xl"
            >
              {Object.entries(columns).map(([status, tasks]) => (
                <Droppable key={status} droppableId={status} type="task">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] flex-shrink-0"
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
                              <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
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
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Detail Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{selectedTask.title}</h2>
            <p className="text-gray-700 mb-4">{selectedTask.description}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
