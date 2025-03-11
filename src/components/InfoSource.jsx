"use client";
import React, { useState } from 'react';

/**
 * Komponente zur Anzeige von Quelleninformationen als Tooltip
 * 
 * @param {Object} props - Die Komponenteneigenschaften
 * @param {Object} props.source - Die Quelleninformation (url, type, date)
 * @param {string} props.className - Zusätzliche CSS-Klassen
 * @param {ReactNode} props.children - Der Inhalt, der mit der Quellenangabe versehen wird
 * @returns {JSX.Element} - InfoSource Komponente
 */
const InfoSource = ({ source, className = "", children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!source) {
    return <>{children}</>;
  }

  // Standardwerte für Quellenangaben
  const {
    url = "#",
    type = "human", // 'human', 'ai', oder 'api'
    date = new Date().toISOString(),
    confidence = null,
    name = "Interne Datenbank"
  } = source;
  
  // Formatiertes Datum
  const formattedDate = new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Icon je nach Quellentyp
  const getSourceIcon = () => {
    switch (type) {
      case 'ai':
        return 'fa-robot';
      case 'api':
        return 'fa-cloud';
      case 'human':
      default:
        return 'fa-user';
    }
  };
  
  // Farbcodierung je nach Quellentyp
  const getSourceColor = () => {
    switch (type) {
      case 'ai':
        return 'text-purple-400';
      case 'api':
        return 'text-blue-400';
      case 'human':
      default:
        return 'text-green-400';
    }
  };
  
  // Quellenbezeichnung
  const getSourceType = () => {
    switch (type) {
      case 'ai':
        return 'KI gesammelt';
      case 'api':
        return 'API Quelle';
      case 'human':
      default:
        return 'Manuell erfasst';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-1">
        {children}
        <i className={`fas ${getSourceIcon()} text-xs ${getSourceColor()} opacity-60 hover:opacity-100 transition-opacity cursor-help`}></i>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-gray-100 p-3 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="flex items-center justify-between mb-2">
            <span className={`flex items-center gap-1 text-sm font-medium ${getSourceColor()}`}>
              <i className={`fas ${getSourceIcon()}`}></i>
              {getSourceType()}
            </span>
            {confidence && (
              <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full">
                {confidence}% Konfidenz
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            <p className="mb-1">Quelle: {name}</p>
            <p className="mb-1">Datum: {formattedDate}</p>
            {url && url !== "#" && (
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline truncate block"
              >
                {url}
              </a>
            )}
          </div>
          
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default InfoSource;
