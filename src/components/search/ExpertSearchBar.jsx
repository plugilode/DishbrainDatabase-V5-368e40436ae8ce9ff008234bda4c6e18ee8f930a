"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getAutocompleteSuggestions } from '../../utils/searchService';
import { useDebounce } from '../../utils/hooks';

const ExpertSearchBar = ({ onSearch, initialQuery = '', placeholder = "Experte, Fähigkeit oder Fachbereich..." }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Debounce das Sucheingabefeld, um zu häufige API-Aufrufe zu vermeiden
  const debouncedQuery = useDebounce(query, 300);

  // Rufe Autovervollständigungsvorschläge ab, wenn sich die Eingabe ändert
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          const { suggestions } = await getAutocompleteSuggestions(debouncedQuery, activeFilter);
          setSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, activeFilter]);

  // Schließe die Vorschläge beim Klicken außerhalb
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle Suchanfrage
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery, activeFilter);
    }
  };

  // Handler für Eingabeänderungen
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Handler für Tastatureingaben
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Wähle einen Vorschlag aus
  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.value);
    handleSearch(suggestion.value);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Ändere den aktiven Filter
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (query.trim()) {
      onSearch(query, filter);
    }
  };

  // Hintergrundfarbe und Text basierend auf dem Typ des Vorschlags
  const getSuggestionStyle = (type) => {
    switch (type) {
      case 'tag':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expertise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'name':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Hintergrundfarbe und Text basierend auf dem aktiven Filter
  const getFilterStyle = (filter) => {
    return activeFilter === filter
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  // Filter-Label basierend auf dem Filter-Wert
  const getFilterLabel = (filter) => {
    switch (filter) {
      case 'all': return 'Alle';
      case 'name': return 'Name';
      case 'tags': return 'Tags';
      case 'expertise': return 'Expertise';
      case 'position': return 'Position';
      case 'organization': return 'Organisation';
      default: return filter;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {['all', 'name', 'tags', 'expertise', 'position', 'organization'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${getFilterStyle(filter)}`}
          >
            {getFilterLabel(filter)}
          </button>
        ))}
      </div>
      
      {/* Sucheingabefeld */}
      <div className="relative">
        <div className="relative" ref={searchInputRef}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setSuggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Suche nach Experten"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
            ) : (
              <button
                onClick={() => handleSearch()}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Suchen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Autovervollständigungsvorschläge */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span 
                      className={`inline-flex items-center px-2 py-0.5 mr-2 rounded text-xs font-medium border ${getSuggestionStyle(suggestion.type)}`}
                    >
                      {suggestion.type === 'tag' && 'Tag'}
                      {suggestion.type === 'expertise' && 'Expertise'}
                      {suggestion.type === 'name' && 'Name'}
                    </span>
                    <span className="truncate">{suggestion.value}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertSearchBar;
