import React, { useState } from 'react';
import '../styles/darkMode.css';
import KiFirmen from '../components/KiFirmen';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'ki-firmen':
        return <KiFirmen />;
      case 'home':
      default:
        return (
          <>
            <h1>Dashboard</h1>
            <p>Welcome to the Dishbrain Database Dashboard!</p>
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li>
            <button 
              className={activeTab === 'home' ? 'active' : ''} 
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'ki-firmen' ? 'active' : ''} 
              onClick={() => setActiveTab('ki-firmen')}
            >
              Ki-Firmen
            </button>
          </li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>
      
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
