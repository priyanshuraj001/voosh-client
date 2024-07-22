import React from 'react';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <AuthForm type="signup" />
    </div>
  );
};

export default Signup;
