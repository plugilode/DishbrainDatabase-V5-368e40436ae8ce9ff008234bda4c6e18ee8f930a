import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const Login = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      toast.success('Login successful');
      onLoginSuccess();
    } else {
      toast.error('Invalid username or password');
    }
  };

  const handleRequestAccess = () => {
    // Simulate sending request to admin
    console.log('Request Access:', requestForm);
    toast.success('Access request sent to admin');
    setShowRequestAccess(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-800 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Internal Dashboard</h1>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4"
          >
            Login
          </button>
          <button
            onClick={() => setShowRequestAccess(true)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            Request Access
          </button>
        </div>
      </div>

      {showRequestAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Request Access</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={requestForm.name}
                onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={requestForm.email}
                onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={requestForm.username}
                onChange={(e) => setRequestForm({ ...requestForm, username: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={requestForm.password}
                onChange={(e) => setRequestForm({ ...requestForm, password: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={handleRequestAccess}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Send Request
            </button>
            <button
              onClick={() => setShowRequestAccess(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
