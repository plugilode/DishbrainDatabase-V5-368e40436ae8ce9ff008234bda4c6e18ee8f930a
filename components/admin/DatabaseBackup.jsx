import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// Hauptkomponente für Datenbank-Backups
const DatabaseBackup = () => {
  const [backupType, setBackupType] = useState('all');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState(localStorage.getItem('lastBackupDate') || null);
  
  // CSV-Exportfunktion
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('Keine Daten zum Exportieren vorhanden');
      return;
    }

    try {
      // Überschriften basierend auf den Schlüsseln des ersten Objekts erstellen
      const headers = Object.keys(data[0]);
      
      // CSV-Header-Zeile erstellen
      let csvContent = headers.join(',') + '\n';
      
      // Datensätze zum CSV hinzufügen
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header];
          
          // Arrays und Objekte als JSON-Strings formatieren
          const cellValue = typeof value === 'object' && value !== null 
            ? JSON.stringify(value).replace(/"/g, '""') 
            : value === null || value === undefined ? '' : String(value);
          
          // Werte mit Kommas oder Anführungszeichen in Anführungszeichen einschließen
          return `"${cellValue.replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\n';
      });
      
      // CSV-Datei zum Download anbieten
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Letztes Backup-Datum aktualisieren
      const now = new Date().toISOString();
      localStorage.setItem('lastBackupDate', now);
      setLastBackupDate(now);
      
      return true;
    } catch (error) {
      console.error('Error creating CSV backup:', error);
      return false;
    }
  };
  
  // Lade Daten aus dem localStorage
  const loadExpertsData = () => {
    try {
      const expertsData = localStorage.getItem('experts');
      return expertsData ? JSON.parse(expertsData) : [];
    } catch (error) {
      console.error('Error loading experts data:', error);
      return [];
    }
  };
  
  const loadCompaniesData = () => {
    try {
      const companiesData = localStorage.getItem('companies');
      return companiesData ? JSON.parse(companiesData) : [];
    } catch (error) {
      console.error('Error loading companies data:', error);
      return [];
    }
  };
  
  // Backup starten
  const handleStartBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      setTimeout(() => {
        let success = false;
        
        // Je nach ausgewähltem Typ die entsprechenden Daten exportieren
        switch (backupType) {
          case 'experts':
            const experts = loadExpertsData();
            success = exportToCSV(experts, `experts_backup_${new Date().toISOString().slice(0, 10)}`);
            break;
          case 'companies':
            const companies = loadCompaniesData();
            success = exportToCSV(companies, `companies_backup_${new Date().toISOString().slice(0, 10)}`);
            break;
          case 'all':
            const allExperts = loadExpertsData();
            const allCompanies = loadCompaniesData();
            const expertsSuccess = exportToCSV(allExperts, `experts_backup_${new Date().toISOString().slice(0, 10)}`);
            const companiesSuccess = exportToCSV(allCompanies, `companies_backup_${new Date().toISOString().slice(0, 10)}`);
            success = expertsSuccess && companiesSuccess;
            break;
        }
        
        if (success) {
          toast.success('Backup erfolgreich erstellt!');
        }
      }, 1000);
    } catch (error) {
      console.error('Error during backup:', error);
      toast.error('Fehler beim Erstellen des Backups');
    } finally {
      setIsCreatingBackup(false);
    }
  };
  
  // Formatiere das Datum für die Anzeige
  const formatDate = (dateString) => {
    if (!dateString) return 'Nie';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Importfunktion (Platzhalter für zukünftige Implementierung)
  const handleImport = () => {
    toast.info('Die Import-Funktion ist noch nicht implementiert');
  };
  
  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 space-y-6">
      <h3 className="text-lg font-semibold text-gray-100">Datenbank-Backup</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linke Seite: Backup-Optionen */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Was möchten Sie sichern?
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="backup-all"
                  name="backup-type"
                  value="all"
                  checked={backupType === 'all'}
                  onChange={() => setBackupType('all')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800"
                />
                <label htmlFor="backup-all" className="ml-3 text-gray-300">
                  Alle Daten (Experten & Unternehmen)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="backup-experts"
                  name="backup-type"
                  value="experts"
                  checked={backupType === 'experts'}
                  onChange={() => setBackupType('experts')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800"
                />
                <label htmlFor="backup-experts" className="ml-3 text-gray-300">
                  Nur Experten
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="backup-companies"
                  name="backup-type"
                  value="companies"
                  checked={backupType === 'companies'}
                  onChange={() => setBackupType('companies')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800"
                />
                <label htmlFor="backup-companies" className="ml-3 text-gray-300">
                  Nur Unternehmen
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">Letztes Backup:</p>
            <p className="text-gray-200">{formatDate(lastBackupDate)}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleStartBackup}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingBackup ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Backup wird erstellt...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  Backup erstellen
                </>
              )}
            </button>
            
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-upload"></i>
              Import
            </button>
          </div>
        </div>
        
        {/* Rechte Seite: Informationen */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <h4 className="font-medium text-gray-200 mb-3">Backup-Informationen</h4>
          
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <i className="fas fa-info-circle mr-2 text-blue-400"></i>
              Backups werden als CSV-Dateien erstellt und können heruntergeladen werden.
            </p>
            <p>
              <i className="fas fa-shield-alt mr-2 text-green-400"></i>
              Alle Daten werden lokal in Ihrem Browser gespeichert.
            </p>
            <p>
              <i className="fas fa-exclamation-triangle mr-2 text-yellow-400"></i>
              Regelmäßige Backups werden empfohlen, um Datenverlust zu vermeiden.
            </p>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium text-gray-300 mb-2">Aktuelle Datenstatistik:</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900/60 p-3 rounded-lg text-center">
                <div className="text-blue-400 text-xl font-bold">{loadExpertsData().length}</div>
                <div className="text-gray-500 text-sm">Experten</div>
              </div>
              <div className="bg-gray-900/60 p-3 rounded-lg text-center">
                <div className="text-green-400 text-xl font-bold">{loadCompaniesData().length}</div>
                <div className="text-gray-500 text-sm">Unternehmen</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBackup;
