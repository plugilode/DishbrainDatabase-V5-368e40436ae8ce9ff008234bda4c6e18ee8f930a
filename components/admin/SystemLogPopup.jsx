import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SystemLogPopup = ({ logs, onClose, onClearLogs }) => {
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    timeframe: '7days',
    search: '',
    module: 'all'
  });
  const [selectedLog, setSelectedLog] = useState(null);
  
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
      case 'user':
        return 'bg-purple-900/20 text-purple-400 border-purple-800/50';
      case 'security':
        return 'bg-indigo-900/20 text-indigo-400 border-indigo-800/50';
      case 'database':
        return 'bg-cyan-900/20 text-cyan-400 border-cyan-800/50';
      case 'system':
        return 'bg-gray-800/50 text-gray-400 border-gray-700/50';
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
  
  // Funktion zum Formatieren des Timestamps
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Filter-Logik
  useEffect(() => {
    let result = [...logs];
    
    // Filter nach Typ
    if (activeFilters.type !== 'all') {
      result = result.filter(log => log.type === activeFilters.type);
    }
    
    // Filter nach Zeitraum
    const now = new Date();
    const timeframeDate = new Date();
    
    switch (activeFilters.timeframe) {
      case '24hours':
        timeframeDate.setDate(now.getDate() - 1);
        result = result.filter(log => new Date(log.timestamp) >= timeframeDate);
        break;
      case '7days':
        timeframeDate.setDate(now.getDate() - 7);
        result = result.filter(log => new Date(log.timestamp) >= timeframeDate);
        break;
      case '30days':
        timeframeDate.setDate(now.getDate() - 30);
        result = result.filter(log => new Date(log.timestamp) >= timeframeDate);
        break;
      // 'all' = keine Filterung nötig
    }
    
    // Filter nach Modul
    if (activeFilters.module !== 'all') {
      result = result.filter(log => log.module === activeFilters.module);
    }
    
    // Filter nach Suchbegriff
    if (activeFilters.search) {
      const searchTerm = activeFilters.search.toLowerCase();
      result = result.filter(log => 
        log.action.toLowerCase().includes(searchTerm) || 
        log.details.toLowerCase().includes(searchTerm) ||
        log.user.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredLogs(result);
  }, [logs, activeFilters]);
  
  // Export-Logs-Funktion
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(filteredLogs, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileName = `system_logs_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.style.display = 'none';
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success('Logs wurden exportiert');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Fehler beim Export der Logs');
    }
  };
  
  // Logs löschen mit Bestätigung
  const confirmClearLogs = () => {
    if (window.confirm('Möchten Sie wirklich alle Logs löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      onClearLogs();
      toast.success('Alle Logs wurden gelöscht');
    }
  };
  
  // Modul-Optionen
  const moduleOptions = [
    { value: 'all', label: 'Alle Module' },
    { value: 'system', label: 'System' },
    { value: 'database', label: 'Datenbank' },
    { value: 'ui', label: 'Benutzeroberfläche' },
    { value: 'auth', label: 'Authentifizierung' },
    { value: 'api', label: 'API' }
  ];
  
  // Typ-Optionen
  const typeOptions = [
    { value: 'all', label: 'Alle Typen' },
    { value: 'error', label: 'Fehler' },
    { value: 'warning', label: 'Warnung' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Erfolg' },
    { value: 'user', label: 'Benutzer' },
    { value: 'security', label: 'Sicherheit' },
    { value: 'database', label: 'Datenbank' },
    { value: 'system', label: 'System' }
  ];
  
  // Zeitraum-Optionen
  const timeframeOptions = [
    { value: '24hours', label: 'Letzte 24 Stunden' },
    { value: '7days', label: 'Letzte 7 Tage' },
    { value: '30days', label: 'Letzte 30 Tage' },
    { value: 'all', label: 'Gesamter Zeitraum' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl w-full max-w-6xl border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">Systemprotokoll</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            aria-label="Schließen"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Filter-Leiste */}
        <div className="p-4 bg-gray-900/50 border-b border-gray-800/50">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Suchfeld */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Suchen..."
                  className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  value={activeFilters.search}
                  onChange={(e) => setActiveFilters({...activeFilters, search: e.target.value})}
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                {activeFilters.search && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setActiveFilters({...activeFilters, search: ''})}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            
            {/* Typ-Filter */}
            <div>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                value={activeFilters.type}
                onChange={(e) => setActiveFilters({...activeFilters, type: e.target.value})}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Modul-Filter */}
            <div>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                value={activeFilters.module}
                onChange={(e) => setActiveFilters({...activeFilters, module: e.target.value})}
              >
                {moduleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Zeitraum-Filter */}
            <div>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                value={activeFilters.timeframe}
                onChange={(e) => setActiveFilters({...activeFilters, timeframe: e.target.value})}
              >
                {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row h-[65vh]">
          {/* Logs Liste */}
          <div className="w-full md:w-3/5 h-full overflow-y-auto border-r border-gray-800/50">
            {filteredLogs.length > 0 ? (
              <div className="divide-y divide-gray-800/50">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 hover:bg-gray-800/30 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-gray-800/50' : ''}`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${getLogTypeStyles(log.type)}`}>
                        <i className={`fas ${getLogTypeIcon(log.type)}`}></i>
                        <span className="text-sm font-medium capitalize">{log.type}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                    </div>
                    <h4 className="font-medium text-gray-200">{log.action}</h4>
                    <div className="text-sm text-gray-400 mt-1 line-clamp-1">{log.details}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-user"></i>
                        {log.user}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center gap-1">
                        <i className="fas fa-folder"></i>
                        {log.module}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-search text-4xl mb-4"></i>
                <p>Keine Logs gefunden</p>
              </div>
            )}
          </div>
          
          {/* Log-Details */}
          <div className="w-full md:w-2/5 h-full p-4 bg-gray-900/30 overflow-y-auto">
            {selectedLog ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-100 pb-2 border-b border-gray-800/50">
                  Log-Details
                </h3>
                
                {/* Log-Typ mit Icon */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getLogTypeStyles(selectedLog.type)}`}>
                  <i className={`fas ${getLogTypeIcon(selectedLog.type)}`}></i>
                  <span>{selectedLog.type}</span>
                </div>
                
                {/* Aktionsdetails */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Aktion</h4>
                  <p className="text-gray-200 mt-1">{selectedLog.action}</p>
                </div>
                
                {/* Zeitstempel */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Zeitstempel</h4>
                  <p className="text-gray-200 mt-1">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                
                {/* Detaillierte Beschreibung */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Details</h4>
                  <div className="mt-1 p-3 bg-gray-800/50 rounded-lg text-gray-300 border border-gray-700/50">
                    {selectedLog.details}
                  </div>
                </div>
                
                {/* Benutzer und IP */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Benutzer</h4>
                    <p className="text-gray-200 mt-1">{selectedLog.user}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">IP-Adresse</h4>
                    <p className="text-gray-200 mt-1">{selectedLog.ip}</p>
                  </div>
                </div>
                
                {/* Modul */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Modul</h4>
                  <p className="text-gray-200 mt-1">{selectedLog.module}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-info-circle text-4xl mb-4"></i>
                <p>Wählen Sie einen Log-Eintrag aus, um Details anzuzeigen</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer mit Aktionen */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/30 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredLogs.length} von {logs.length} Logs angezeigt
          </div>
          <div className="flex gap-3">
            <button 
              onClick={confirmClearLogs}
              className="px-3 py-2 bg-red-700/80 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-trash"></i>
              Logs löschen
            </button>
            <button 
              onClick={exportLogs}
              className="px-3 py-2 bg-blue-700/80 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              Exportieren
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogPopup;
