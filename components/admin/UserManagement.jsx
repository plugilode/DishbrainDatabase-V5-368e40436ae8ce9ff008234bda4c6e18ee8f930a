import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserManagementPopup from './UserManagementPopup';

const DEFAULT_AVATAR = "/experts/avatar.jpg";

const UserManagement = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);

  // Demo-Benutzer für die Initialisierung
  const DEMO_USERS = [
    { 
      id: 'user1', 
      name: 'Patrick Blanks', 
      email: 'patrick.blanks@plugilo.com', 
      role: 'Administrator',
      lastLogin: new Date(Date.now() - 1000*60*60*2).toISOString(),
      status: 'active',
      profileImage: DEFAULT_AVATAR
    },
    { 
      id: 'user2', 
      name: 'Maria Schmidt', 
      email: 'maria.schmidt@techsolution.de', 
      role: 'Manager',
      lastLogin: new Date(Date.now() - 1000*60*60*24).toISOString(),
      status: 'active',
      profileImage: DEFAULT_AVATAR
    },
    { 
      id: 'user3', 
      name: 'Alexander Müller', 
      email: 'alex.mueller@dataexpert.com', 
      role: 'Redakteur',
      lastLogin: new Date(Date.now() - 1000*60*60*48).toISOString(),
      status: 'active',
      profileImage: DEFAULT_AVATAR
    },
    { 
      id: 'user4', 
      name: 'Sandra König', 
      email: 'sandra.koenig@example.com', 
      role: 'Benutzer',
      lastLogin: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
      status: 'inactive',
      profileImage: DEFAULT_AVATAR
    },
    { 
      id: 'user5', 
      name: 'Markus Weber', 
      email: 'markus.weber@example.com', 
      role: 'Benutzer',
      lastLogin: new Date(Date.now() - 1000*60*60*24*10).toISOString(),
      status: 'pending',
      profileImage: DEFAULT_AVATAR
    },
  ];

  // Benutzer beim Laden initialisieren
  useEffect(() => {
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        const active = parsedUsers.filter(user => user.status === 'active').length;
        setActiveUsers(active);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        // Fallback zu Demo-Benutzern
        setUsers(DEMO_USERS);
        setActiveUsers(DEMO_USERS.filter(user => user.status === 'active').length);
      }
    } else {
      // Wenn keine gespeicherten Benutzer, initialisiere mit Demo-Benutzern
      setUsers(DEMO_USERS);
      localStorage.setItem('systemUsers', JSON.stringify(DEMO_USERS));
      setActiveUsers(DEMO_USERS.filter(user => user.status === 'active').length);
    }
  }, []);

  // Handler für Benutzeraktualisierungen
  const handleUserUpdate = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    const active = updatedUsers.filter(user => user.status === 'active').length;
    setActiveUsers(active);
    toast.success('Benutzer wurden aktualisiert');
  };

  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
        <i className="fas fa-users text-xl"></i>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Benutzerverwaltung</h3>
        <p className="text-gray-400 mb-4">Benutzer erstellen, bearbeiten oder Rollen und Berechtigungen verwalten.</p>
        
        {/* Übersicht der letzten Benutzeraktivitäten */}
        <div className="space-y-2 mb-4">
          {users.slice(0, 3).map((user) => (
            <div key={user.id} className="p-2 bg-gray-800/30 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  user.status === 'active' ? 'bg-green-500' : 
                  user.status === 'inactive' ? 'bg-gray-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-gray-300">{user.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {user.status === 'active' ? 'Online' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{activeUsers} aktive Benutzer</span>
          <button 
            onClick={() => setShowPopup(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Verwalten
          </button>
        </div>
      </div>
      
      {showPopup && (
        <UserManagementPopup 
          users={users}
          onClose={() => setShowPopup(false)}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};

export default UserManagement;
