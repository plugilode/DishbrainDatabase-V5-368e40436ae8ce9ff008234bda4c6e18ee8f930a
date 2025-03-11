import React, { useState, useEffect } from 'react';
import SystemLogPopup from './SystemLogPopup';

// Log-Einträge nach Typ stylen
const getLogTypeStyles = (type) => {
  switch (type) {
    case 'error':
      return 'bg-red-900/20 text-red-400 border-red-800/50';
    case 'warning':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-800/50';
    case 'info':
      return 'bg-blue-900/20 text-blue-400 border-blue-800/50';
    case 'success':
      return 'bg-green-900/20 text-green-400 border-green-800/50';
    default:
      return 'bg-gray-800/50 text-gray-400 border-gray-700/50';
  }
};

// Icon nach Log-Typ
const getLogTypeIcon = (type) => {
  switch (type) {
    case 'error':
      return 'fa-exclamation-circle';
    case 'warning':
      return 'fa-exclamation-triangle';
    case 'info':
      return 'fa-info-circle';
    case 'success':
      return 'fa-check-circle';
    case 'user':
      return 'fa-user';
    case 'security':
      return 'fa-shield-alt';
    case 'database':
      return 'fa-database';
    case 'system':
      return 'fa-server';
    default:
      return 'fa-circle';
  }
};

const SystemLog = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [warningsCount, setWarningsCount] = useState(0);
  
  // Zufällige Demo-Logs generieren
  const generateMockLogs = () => {
    const logTypes = ['error', 'warning', 'info', 'success', 'user', 'security', 'database', 'system'];
    const actions = [
      'Benutzer angemeldet',
      'Datensatz aktualisiert',
      'Datei hochgeladen',
      'API-Anfrage fehlgeschlagen',
      'Datenbank-Backup erstellt',
      'Ungültiger Anmeldeversuch',
      'System-Update durchgeführt',
      'Neuer Experte hinzugefügt',
      'Expertenakten gelöscht',
      'Neue Unternehmensdetails eingetragen',
      'Speicherkapazität erreicht kritischen Wert',
      'Datenbankverbindung wiederhergestellt',
      'Benutzer abgemeldet',
      'Änderungen gespeichert'
    ];
    
    // Generiere verschiedene Zeitstempel der letzten 7 Tage
    const getRandomDate = () => {
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 7); // 0-6 Tage zurück
      const hoursAgo = Math.floor(Math.random() * 24); // 0-23 Stunden zurück
      const minutesAgo = Math.floor(Math.random() * 60); // 0-59 Minuten zurück
      
      now.setDate(now.getDate() - daysAgo);
      now.setHours(now.getHours() - hoursAgo);
      now.setMinutes(now.getMinutes() - minutesAgo);
      
      return now.toISOString();
    };
    
    // Generiere 50 Logs mit zufälligen Werten
    const logs = [];
    
    for (let i = 0; i < 50; i++) {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = getRandomDate();
      const id = `log-${Date.now()}-${i}`;
      
      // Details je nach Log-Typ
      const details = type === 'error' ? 'Fehler 404: Ressource nicht gefunden' :
                    type === 'warning' ? 'Ressourcennutzung über 80%' :
                    type === 'info' ? 'System läuft normal' :
                    type === 'success' ? 'Operation erfolgreich abgeschlossen' :
                    type === 'user' ? 'Benutzeraktion verarbeitet' :
                    type === 'security' ? 'Sicherheitsprotokoll aktiviert' :
                    type === 'database' ? 'Datenbankverbindung hergestellt' :
                    'System-Update durchgeführt';
      
      // IP und Benutzer (für realistische Logs)
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const user = Math.random() > 0.5 ? 'admin@system.de' : 'user@system.de';
      
      logs.push({
        id,
        type,
        action,
        timestamp,
        details,
        ip,
        user,
        module: ['system', 'database', 'ui', 'auth', 'api'][Math.floor(Math.random() * 5)]
      });
    }
    
    // Sortiere nach Zeitstempel (neueste zuerst)
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const [logs, setLogs] = useState([]);

  // Logs beim Laden initialisieren
  useEffect(() => {
    const storedLogs = localStorage.getItem('systemLogs');
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs);
      setLogs(parsedLogs);
      
      // Zähle Warnungen
      const warningCount = parsedLogs.filter(log => 
        log.type === 'warning' || log.type === 'error'
      ).length;
      setWarningsCount(warningCount);
    } else {
      // Wenn keine Logs vorhanden sind, generiere Demo-Logs
      const demoLogs = generateMockLogs();
      setLogs(demoLogs);
      localStorage.setItem('systemLogs', JSON.stringify(demoLogs));
      
      // Zähle Warnungen
      const warningCount = demoLogs.filter(log => 
        log.type === 'warning' || log.type === 'error'
      ).length;
      setWarningsCount(warningCount);
    }
  }, []);
  
  // Funktion zum Formatieren des Timestamps
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400">
        <i className="fas fa-file-alt text-xl"></i>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">System-Log</h3>
        <p className="text-gray-400 mb-4">Systemprotokolle einsehen und analysieren.</p>
        
        {/* Aktuelle Log-Einträge Preview anzeigen */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {logs.slice(0, 3).map((log) => (
            <div 
              key={log.id} 
              className={`p-2 rounded-lg border ${getLogTypeStyles(log.type)} text-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className={`fas ${getLogTypeIcon(log.type)}`}></i>
                  <span>{log.action}</span>
                </div>
                <span className="text-xs opacity-70">{formatTimestamp(log.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {warningsCount > 0 ? `${warningsCount} neue Warnungen` : 'Keine neuen Warnungen'}
          </span>
          <button 
            onClick={() => setShowPopup(true)}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            Logs anzeigen
          </button>
        </div>
      </div>
      
      {showPopup && (
        <SystemLogPopup 
          logs={logs} 
          onClose={() => setShowPopup(false)}
          onClearLogs={() => {
            setLogs([]);
            localStorage.removeItem('systemLogs');
            setWarningsCount(0);
          }} 
        />
      )}
    </div>
  );
};

export default SystemLog;
