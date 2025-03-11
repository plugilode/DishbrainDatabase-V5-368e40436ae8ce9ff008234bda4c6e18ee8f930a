import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const DEFAULT_AVATAR = "/experts/avatar.jpg";

const UserManagementPopup = ({ users, onClose, onUpdate }) => {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter anwenden, wenn sich Suchanfrage oder Filter ändern
  useEffect(() => {
    let result = [...users];
    
    // Textsuche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    // Rollenfilter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Statusfilter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Benutzerbearbeitung starten
  const startEditing = (user) => {
    setSelectedUser(user);
    setEditForm({...user});
    setIsEditing(true);
  };
  
  // Neuen Benutzer erstellen
  const startCreatingUser = () => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: 'Benutzer',
      status: 'pending',
      profileImage: DEFAULT_AVATAR,
      lastLogin: null
    };
    setSelectedUser(null);
    setEditForm(newUser);
    setIsEditing(true);
  };

  // Änderung im Formular speichern
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  // Formular absenden
  const handleSubmit = () => {
    // Validierung
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error('Name und E-Mail sind erforderlich');
      return;
    }
    
    if (!editForm.email.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }
    
    // Neuer oder aktualisierter Benutzer?
    if (selectedUser) {
      // Existierenden Benutzer updaten
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? editForm : user
      );
      onUpdate(updatedUsers);
      toast.success(`Benutzer ${editForm.name} wurde aktualisiert`);
    } else {
      // Neuen Benutzer erstellen
      const updatedUsers = [...users, editForm];
      onUpdate(updatedUsers);
      toast.success(`Benutzer ${editForm.name} wurde erstellt`);
    }
    
    setIsEditing(false);
    setSelectedUser(null);
  };

  // Benutzer löschen starten
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  };

  // Benutzer löschen bestätigen
  const confirmDelete = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    onUpdate(updatedUsers);
    toast.success(`Benutzer ${userToDelete.name} wurde gelöscht`);
    
    setShowConfirmDialog(false);
    setUserToDelete(null);
    setSelectedUser(null);
    setIsEditing(false);
  };

  // Benutzer Status aktualisieren
  const updateUserStatus = (user, status) => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? {...u, status} : u
    );
    onUpdate(updatedUsers);
    toast.success(`Status von ${user.name} wurde auf ${status} geändert`);
  };

  // Formatiere das Datum für die Anzeige
  const formatDate = (dateString) => {
    if (!dateString) return 'Nie';
    return new Date(dateString).toLocaleString('de-DE');
  };

  // Status-Label und Styles
  const renderStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Aktiv</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs">Inaktiv</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Ausstehend</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs">Gesperrt</span>;
      default:
        return <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs">Unbekannt</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl w-full max-w-6xl border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">Benutzerverwaltung</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Haupt-Content */}
        <div className="flex flex-col lg:flex-row h-[70vh]">
          {/* Linke Seite: Benutzerliste */}
          <div className={`w-full ${isEditing ? 'lg:w-1/2' : 'lg:w-full'} h-full border-r border-gray-800/50 flex flex-col`}>
            {/* Suchleiste und Filter */}
            <div className="p-4 border-b border-gray-800/50 bg-gray-900/50">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Suchfeld */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Suchen..."
                    className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                
                {/* Filter */}
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Alle Rollen</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Redakteur">Redakteur</option>
                    <option value="Benutzer">Benutzer</option>
                  </select>
                  
                  <select
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Alle Status</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="pending">Ausstehend</option>
                    <option value="suspended">Gesperrt</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Benutzer Liste */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                <div className="divide-y divide-gray-800/50">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 hover:bg-gray-800/30 cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? 'bg-gray-800/50' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-gray-700/50">
                            <img
                              src={user.profileImage || DEFAULT_AVATAR}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_AVATAR;
                              }}
                            />
                            <div className={`absolute w-2.5 h-2.5 rounded-full border border-gray-900 right-0 bottom-0 ${
                              user.status === 'active' ? 'bg-green-500' : 
                              user.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-200 line-clamp-1">{user.name}</h3>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50">
                            {user.role}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Letzter Login: {formatDate(user.lastLogin)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <i className="fas fa-search text-4xl mb-4"></i>
                  <p>Keine Benutzer gefunden</p>
                </div>
              )}
            </div>
            
            {/* Aktionsleiste */}
            <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} von {users.length} Benutzern
                </span>
                <button
                  onClick={startCreatingUser}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Neuer Benutzer
                </button>
              </div>
            </div>
          </div>

          {/* Rechte Seite: Benutzerdetails oder Bearbeitungsformular */}
          {isEditing ? (
            <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-gray-900/30">
              <h3 className="text-lg font-medium text-gray-100 pb-2 border-b border-gray-800/50 mb-4">
                {selectedUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
              </h3>
              
              <div className="space-y-4">
                {/* Profilbild */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700/50">
                    <img
                      src={editForm.profileImage || DEFAULT_AVATAR}
                      alt="Profilbild"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-white text-sm">Bild ändern</span>
                    </div>
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleFormChange}
                    placeholder="Vollständiger Name"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    required
                  />
                </div>
                
                {/* E-Mail */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    E-Mail*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ''}
                    onChange={handleFormChange}
                    placeholder="email@beispiel.com"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    required
                  />
                </div>
                
                {/* Rolle */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Rolle
                  </label>
                  <select
                    name="role"
                    value={editForm.role || 'Benutzer'}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Redakteur">Redakteur</option>
                    <option value="Benutzer">Benutzer</option>
                  </select>
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status || 'pending'}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="pending">Ausstehend</option>
                    <option value="suspended">Gesperrt</option>
                  </select>
                </div>
                
                {/* Passwort (nur bei neuem Benutzer) */}
                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Passwort*
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleFormChange}
                      placeholder="Sicheres Passwort eingeben"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      required
                    />
                  </div>
                )}
                
                {/* Aktionen */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800/50">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedUser(null);
                    }}
                    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-save"></i>
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          ) : selectedUser ? (
            <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-gray-900/30">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-100">
                  Benutzerdetails
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(selectedUser)}
                    className="p-2 rounded-lg text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedUser)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Profilbild und Basisdaten */}
                <div className="flex flex-col items-center space-y-3 mb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700/50">
                    <img
                      src={selectedUser.profileImage || DEFAULT_AVATAR}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className={`absolute w-4 h-4 rounded-full border-2 border-gray-900 right-0 bottom-0 ${
                      selectedUser.status === 'active' ? 'bg-green-500' : 
                      selectedUser.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <h2 className="text-xl font-medium text-gray-100">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2">
                    {renderStatusLabel(selectedUser.status)}
                    <span className="text-sm px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                
                {/* Kontaktinformationen */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Kontaktinformationen
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-envelope text-gray-500 w-5"></i>
                      <span className="text-gray-300">{selectedUser.email}</span>
                    </div>
                  </div>
                </div>
                
                {/* Aktivität */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Aktivität
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-clock text-gray-500 w-5"></i>
                      <span className="text-gray-300">Letzter Login: {formatDate(selectedUser.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Management */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Status Management
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUser.status !== 'active' && (
                      <button
                        onClick={() => updateUserStatus(selectedUser, 'active')}
                        className="px-3 py-2 bg-green-700/50 text-green-300 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
                      >
                        <i className="fas fa-check-circle"></i>
                        Aktivieren
                      </button>
                    )}
                    {selectedUser.status !== 'inactive' && (
                      <button
                        onClick={() => updateUserStatus(selectedUser, 'inactive')}
                        className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center"
                      >
                        <i className="fas fa-pause-circle"></i>
                        Deaktivieren
                      </button>
                    )}
                    {selectedUser.status !== 'suspended' && (
                      <button
                        onClick={() => updateUserStatus(selectedUser, 'suspended')}
                        className="px-3 py-2 bg-red-700/50 text-red-300 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 justify-center"
                      >
                        <i className="fas fa-ban"></i>
                        Sperren
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Passwort-Reset */}
                <div className="pt-4 border-t border-gray-800/50">
                  <button
                    className="w-full px-4 py-2 bg-blue-900/30 text-blue-400 border border-blue-800/50 rounded-lg hover:bg-blue-900/50 transition-colors"
                  >
                    <i className="fas fa-key mr-2"></i>
                    Passwort zurücksetzen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-gray-900/30 flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-user-circle text-6xl mb-4"></i>
              <p>Wählen Sie einen Benutzer aus oder erstellen Sie einen neuen Benutzer</p>
              <button
                onClick={startCreatingUser}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Neuen Benutzer erstellen
              </button>
            </div>
          )}
        </div>

        {/* Löschen-Bestätigungs-Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 max-w-md w-full border border-gray-800 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-100 mb-4">Benutzer löschen</h3>
              <p className="text-gray-300 mb-6">
                Sind Sie sicher, dass Sie den Benutzer <span className="font-semibold">{userToDelete?.name}</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPopup;
