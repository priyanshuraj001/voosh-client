import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board';
import Header from './components/Header';
import Task from './pages/Task';
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/board" element={<ProtectedRoute element={Board} />} />
            <Route path="/create-task" element={<ProtectedRoute element={Task} />} />
          </Routes>
        </DndProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
