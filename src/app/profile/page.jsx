"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    bio: '',
  });

  // Prüfen, ob der Benutzer angemeldet ist und Daten laden
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                         sessionStorage.getItem('isLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      
      // Benutzerdaten laden
      try {
        const userData = JSON.parse(
          localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
        );
        
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'Benutzer',
          company: userData.company || '',
          bio: userData.bio || '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Fehler beim Laden der Benutzerdaten');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    try {
      // Aktualisierte Benutzerdaten speichern
      const updatedUser = { ...user, ...formData };
      
      if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      if (sessionStorage.getItem('isLoggedIn') === 'true') {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profil erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Fehler beim Speichern des Profils');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 shadow-2xl border border-gray-800/50">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Benutzerprofil
            </h1>
            
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Speichern
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Abbrechen
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Bearbeiten
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profilbild und Statusinformationen */}
            <div className="col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <i className="fas fa-camera"></i>
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-100">{user?.name}</h2>
                <p className="text-gray-400">{user?.role || 'Benutzer'}</p>
                
                <div className="text-sm text-gray-500">
                  <p>Letzter Login: {new Date(user?.lastLogin).toLocaleString('de-DE')}</p>
                </div>
                
                <button 
                  onClick={() => router.push('/')}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors mt-4"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Zurück zum Dashboard
                </button>
              </div>
            </div>

            {/* Profilinformationen */}
            <div className="col-span-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      />
                    ) : (
                      <p className="text-gray-100 py-2">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      E-Mail
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      />
                    ) : (
                      <p className="text-gray-100 py-2">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rolle
                    </label>
                    {isEditing ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      >
                        <option value="Benutzer">Benutzer</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Editor">Editor</option>
                        <option value="Gast">Gast</option>
                      </select>
                    ) : (
                      <p className="text-gray-100 py-2">{user?.role || 'Benutzer'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Unternehmen
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      />
                    ) : (
                      <p className="text-gray-100 py-2">{user?.company || 'Nicht angegeben'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Über mich
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    />
                  ) : (
                    <p className="text-gray-100 py-2">
                      {user?.bio || 'Keine Beschreibung vorhanden'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
