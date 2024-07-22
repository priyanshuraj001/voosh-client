import React from 'react';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 break-words">{task.title}</h2>
        <p className="text-gray-700 mb-4 break-words whitespace-pre-wrap">{task.description}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
