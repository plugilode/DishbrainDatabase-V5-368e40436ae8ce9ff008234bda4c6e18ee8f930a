import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ApiManager = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('30');
  
  // Demo API-Schlüssel für die Initialisierung
  const DEMO_API_KEYS = [
    {
      id: 'api-key-1',
      name: 'Web Dashboard',
      key: 'pk_live_298f7e5b3a9c5d1f4e8b3c2d1a0f9e8d7c6b5a4',
      created: new Date(Date.now() - 1000*60*60*24*30).toISOString(), // 30 Tage alt
      expires: new Date(Date.now() + 1000*60*60*24*60).toISOString(), // 60 Tage in Zukunft
      lastUsed: new Date(Date.now() - 1000*60*60*2).toISOString(), // 2 Stunden her
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: 'api-key-2',
      name: 'Mobile App',
      key: 'pk_live_8d7c6b5a4f9e3d2c1a0b9e8d7c6b5a4f3e2d1c0',
      created: new Date(Date.now() - 1000*60*60*24*60).toISOString(), // 60 Tage alt
      expires: new Date(Date.now() + 1000*60*60*24*30).toISOString(), // 30 Tage in Zukunft
      lastUsed: new Date(Date.now() - 1000*60*60*12).toISOString(), // 12 Stunden her
      status: 'active',
      permissions: ['read']
    },
    {
      id: 'api-key-3',
      name: 'Integration Partner',
      key: 'pk_live_5a4f9e3d2c1a0b9e8d7c6b5a4f3e2d1c0b9a8e7',
      created: new Date(Date.now() - 1000*60*60*24*15).toISOString(), // 15 Tage alt
      expires: new Date(Date.now() + 1000*60*60*24*15).toISOString(), // 15 Tage in Zukunft
      lastUsed: new Date(Date.now() - 1000*60*60*24*3).toISOString(), // 3 Tage her
      status: 'active',
      permissions: ['read', 'write', 'delete']
    },
    {
      id: 'api-key-4',
      name: 'Analytics Tool',
      key: 'pk_live_1a0b9e8d7c6b5a4f3e2d1c0b9a8e7f6d5c4b3a2',
      created: new Date(Date.now() - 1000*60*60*24*100).toISOString(), // 100 Tage alt
      expires: new Date(Date.now() - 1000*60*60*24*20).toISOString(), // 20 Tage abgelaufen
      lastUsed: new Date(Date.now() - 1000*60*60*24*25).toISOString(), // 25 Tage her
      status: 'expired',
      permissions: ['read']
    },
    {
      id: 'api-key-5',
      name: 'Test Environment',
      key: 'pk_test_0b9a8e7f6d5c4b3a2e1d0c9b8a7f6e5d4c3b2a1',
      created: new Date(Date.now() - 1000*60*60*24*10).toISOString(), // 10 Tage alt
      expires: new Date(Date.now() + 1000*60*60*24*355).toISOString(), // 355 Tage in Zukunft
      lastUsed: null,
      status: 'inactive',
      permissions: ['read', 'write']
    }
  ];

  // API-Schlüssel beim Laden initialisieren
  useEffect(() => {
    const storedApiKeys = localStorage.getItem('apiKeys');
    if (storedApiKeys) {
      try {
        setApiKeys(JSON.parse(storedApiKeys));
      } catch (error) {
        console.error('Error parsing stored API keys:', error);
        // Fallback zu Demo-Schlüsseln
        setApiKeys(DEMO_API_KEYS);
        localStorage.setItem('apiKeys', JSON.stringify(DEMO_API_KEYS));
      }
    } else {
      // Wenn keine gespeicherten Schlüssel, initialisiere mit Demo-Schlüsseln
      setApiKeys(DEMO_API_KEYS);
      localStorage.setItem('apiKeys', JSON.stringify(DEMO_API_KEYS));
    }
  }, []);

  // Format a date string into a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Nie';
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  // Check if a date is in the past
  const isExpired = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) < new Date();
    } catch (e) {
      return false;
    }
  };

  // Generate a random API key
  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'pk_' + (Math.random() > 0.5 ? 'live_' : 'test_');
    for (let i = 0; i < 40; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create a new API key
  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Bitte geben Sie einen Namen für den API-Schlüssel ein');
      return;
    }
    
    const days = parseInt(newKeyExpiry, 10);
    if (isNaN(days) || days <= 0) {
      toast.error('Bitte geben Sie eine gültige Anzahl von Tagen ein');
      return;
    }
    
    const newKey = {
      id: `api-key-${Date.now()}`,
      name: newKeyName.trim(),
      key: generateApiKey(),
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 1000*60*60*24*days).toISOString(),
      lastUsed: null,
      status: 'active',
      permissions: ['read', 'write']
    };
    
    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
    
    toast.success('API-Schlüssel erstellt');
    setShowGenerateDialog(false);
    setNewKeyName('');
    setNewKeyExpiry('30');
  };

  // Toggle API key status (active/inactive)
  const toggleApiKeyStatus = (id) => {
    const updatedKeys = apiKeys.map(key => {
      if (key.id === id) {
        const newStatus = key.status === 'active' ? 'inactive' : 'active';
        return { ...key, status: newStatus };
      }
      return key;
    });
    
    setApiKeys(updatedKeys);
    localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
    toast.success('API-Schlüssel-Status aktualisiert');
  };

  // Delete an API key
  const deleteApiKey = (id) => {
    if (confirm('Sind Sie sicher, dass Sie diesen API-Schlüssel löschen möchten?')) {
      const updatedKeys = apiKeys.filter(key => key.id !== id);
      setApiKeys(updatedKeys);
      localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
      toast.success('API-Schlüssel gelöscht');
    }
  };

  // Get active API keys count
  const getActiveKeysCount = () => {
    return apiKeys.filter(key => key.status === 'active' && !isExpired(key.expires)).length;
  };

  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
        <i className="fas fa-code text-xl"></i>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">API-Verwaltung</h3>
        <p className="text-gray-400 mb-4">API-Schlüssel generieren und API-Zugriffe überwachen.</p>
        
        {/* API Keys Preview */}
        <div className="space-y-2 mb-4">
          {apiKeys.slice(0, 3).map(key => (
            <div key={key.id} className="p-2 bg-gray-800/30 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  key.status === 'active' && !isExpired(key.expires) ? 'bg-green-500' : 
                  key.status === 'expired' || isExpired(key.expires) ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-300">{key.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {isExpired(key.expires) ? 'Abgelaufen' : `Läuft ab: ${formatDate(key.expires)}`}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{getActiveKeysCount()} aktive API-Schlüssel</span>
          <button 
            onClick={() => setShowGenerateDialog(true)}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Verwalten
          </button>
        </div>
      </div>
      
      {/* API Key Generation Dialog */}
      {showGenerateDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl w-full max-w-lg border border-gray-800/50 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100">API-Schlüssel verwalten</h2>
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Neuen Schlüssel erstellen</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Name des Schlüssels
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="z.B. Web Dashboard, Mobile App"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Gültigkeitsdauer (Tage)
                    </label>
                    <input
                      type="number"
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(e.target.value)}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                    />
                  </div>
                  
                  <button
                    onClick={createNewApiKey}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Schlüssel erstellen
                  </button>
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Vorhandene Schlüssel</h3>
                
                {apiKeys.length > 0 ? (
                  <div className="space-y-3">
                    {apiKeys.map(key => (
                      <div 
                        key={key.id}
                        className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              key.status === 'active' && !isExpired(key.expires) ? 'bg-green-500' : 
                              key.status === 'expired' || isExpired(key.expires) ? 'bg-red-500' : 'bg-gray-500'
                            }`}></div>
                            <h4 className="font-medium text-gray-200">{key.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleApiKeyStatus(key.id)}
                              className={`p-1 rounded ${
                                key.status === 'active' ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
                              }`}
                              disabled={isExpired(key.expires)}
                            >
                              <i className={`fas ${key.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                            </button>
                            <button
                              onClick={() => deleteApiKey(key.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 p-2 rounded-md font-mono text-xs text-gray-400 mb-2 overflow-x-auto">
                          {key.key}
                        </div>
                        
                        <div className="grid grid-cols-2 text-xs">
                          <div className="text-gray-500">
                            Erstellt: {formatDate(key.created)}
                          </div>
                          <div className={`${isExpired(key.expires) ? 'text-red-400' : 'text-gray-500'}`}>
                            Läuft ab: {formatDate(key.expires)}
                          </div>
                          <div className="text-gray-500 mt-1">
                            Letzte Nutzung: {key.lastUsed ? formatDate(key.lastUsed) : 'Nie'}
                          </div>
                          <div className="text-gray-500 mt-1">
                            Berechtigungen: {key.permissions.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>Keine API-Schlüssel vorhanden</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-800/50 flex justify-end">
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManager;
