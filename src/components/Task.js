import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`task ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
};

export default Task;
