import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Column = ({ status, tasks, onDropTask }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-gray-100 p-4 rounded-lg w-1/3"
      >
        <h2 className="text-xl font-bold mb-4 capitalize">{status}</h2>
        {tasks.map((task, index) => (
          <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-white p-4 mb-4 shadow rounded-lg"
              >
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default Column;
