import React, { useState } from 'react';
import Login from '../components/Login';
import users from '../data/users.json';

// Import Dashboard from the same directory
import Dashboard from './Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    console.log('Login successful');
    setIsLoggedIn(true);
  };

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <Login users={users} onLoginSuccess={handleLoginSuccess} />
  );
};

export default App;
