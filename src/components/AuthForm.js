import React, { useState, useContext } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { AuthContext } from '../context/AuthContext';
import { storage } from '../components/firebase/firebase.init';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedImage(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 

    try {
      let avatarUrl;
      if (selectedImage) {
        const imageRef = ref(storage, `avatars/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        avatarUrl = await getDownloadURL(imageRef);
      }

      const res = type === 'login'
        ? await axios.post('/auth/login', { email, password })
        : await axios.post('/auth/register', { email, password, username, avatar: avatarUrl });

      const token = res.data.token;
      localStorage.setItem('token', token);

     
      const userRes = await axios.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data); 
      localStorage.setItem('user', JSON.stringify(userRes.data));
      navigate('/board');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-sm mx-auto p-4">
      {loading && <Loader />}
      <form onSubmit={handleSubmit} className="relative">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {type === 'signup' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

