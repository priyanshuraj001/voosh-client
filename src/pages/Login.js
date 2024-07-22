import React from 'react';
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <AuthForm type="login" />
    </div>
  );
};

export default Login;
