import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CompaniesOverview = ({ onViewCompanyDetails }) => {
  const router = useRouter();
  
  // Beispieldaten für die Zusammenfassung
  const summaryData = {
    totalCompanies: 156,
    topIndustry: "GesundheitsTech",
    newStartups: 8,
    growth: "+12%"
  };

  // Beispiel-Unternehmensdaten
  const companyData = [
    {
      id: 'comp-1',
      name: 'NeuroAI Health',
      logo: 'https://logo.clearbit.com/neuroaihealth.com', // Beispiel-Logo (fiktiv)
      category: 'GesundheitsTech',
      location: 'Berlin',
      employees: '50-100',
      founded: 2019,
      aiTech: ['Computer Vision', 'Machine Learning'],
      description: 'Spezialisiert auf KI-gestützte medizinische Bildgebung und Diagnose'
    },
    {
      id: 'comp-2',
      name: 'DataSense AG',
      logo: 'https://logo.clearbit.com/datasense.de',
      category: 'Big Data',
      location: 'München',
      employees: '100-250',
      founded: 2017,
      aiTech: ['Data Mining', 'Predictive Analytics'],
      description: 'Plattform für intelligente Datenanalyse und Vorhersagemodelle'
    },
    {
      id: 'comp-3',
      name: 'RoboLogic GmbH',
      logo: 'https://logo.clearbit.com/robologic.de',
      category: 'Robotik',
      location: 'Hamburg',
      employees: '25-50',
      founded: 2021,
      aiTech: ['Reinforcement Learning', 'Robotics'],
      description: 'Entwicklung von autonomen Robotersystemen für die Logistik'
    },
    {
      id: 'comp-4',
      name: 'VoiceGenius',
      logo: 'https://logo.clearbit.com/voicegenius.ai',
      category: 'NLP',
      location: 'Frankfurt',
      employees: '10-25',
      founded: 2022,
      aiTech: ['Natural Language Processing', 'Speech Recognition'],
      description: 'Fortschrittliche Spracherkennung und Konversations-KI'
    },
  ];

  // Zeige alle Firmen-Karte an
  const handleViewAllCompanies = () => {
    router.push('/companies');
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800/50 shadow-xl overflow-hidden">
      {/* Header mit Statistiken */}
      <div className="p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-gray-800/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">KI Unternehmen</h2>
          <button
            onClick={handleViewAllCompanies}
            className="px-3 py-1 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg text-sm text-white transition-colors"
          >
            Alle KI-Firmen
          </button>
        </div>
        
        {/* Statistiken */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-3 border border-gray-700/50">
            <p className="text-2xl font-bold text-blue-400">{summaryData.totalCompanies}</p>
            <p className="text-xs text-gray-400 mt-1">Gesamt Unternehmen</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-3 border border-gray-700/50">
            <p className="text-2xl font-bold text-green-400">{summaryData.topIndustry}</p>
            <p className="text-xs text-gray-400 mt-1">Top Branche</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-3 border border-gray-700/50">
            <p className="text-2xl font-bold text-purple-400">{summaryData.newStartups}</p>
            <p className="text-xs text-gray-400 mt-1">Neue Startups</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-3 border border-gray-700/50">
            <p className="text-2xl font-bold text-yellow-400">{summaryData.growth}</p>
            <p className="text-xs text-gray-400 mt-1">Wachstum (QoQ)</p>
          </div>
        </div>
      </div>
      
      {/* Liste der Unternehmen */}
      <div className="divide-y divide-gray-800/50">
        {companyData.map((company) => (
          <div key={company.id} className="p-4 hover:bg-gray-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-800/80 border border-gray-700/50 overflow-hidden flex-shrink-0">
                <img 
                  src={company.logo} 
                  alt={`${company.name} Logo`} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-company-logo.png'; // Fallback-Logo
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-medium text-gray-200 truncate">{company.name}</h3>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs border border-blue-800/50 whitespace-nowrap mt-1 sm:mt-0">
                    {company.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-gray-400 flex items-center">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {company.location}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <i className="fas fa-users mr-1"></i>
                    {company.employees}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <i className="fas fa-calendar mr-1"></i>
                    Gegründet {company.founded}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onViewCompanyDetails(company)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors whitespace-nowrap"
              >
                Mehr Info
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer mit Weiterleitungsknopf */}
      <div className="p-4 border-t border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-800">
        <button
          onClick={handleViewAllCompanies}
          className="w-full px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
        >
          <i className="fas fa-building mr-2"></i>
          Alle KI-Firmen anzeigen
        </button>
      </div>
    </div>
  );
};

export default CompaniesOverview;
