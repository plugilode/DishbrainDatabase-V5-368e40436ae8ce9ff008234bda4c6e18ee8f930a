import React, { useState, useEffect } from 'react';
import '../styles/darkMode.css';

const KiFirmen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    // Here you would fetch your Ki-Firmen data
    // This is a placeholder
    const fetchCompanies = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/ki-firmen');
        // const data = await response.json();
        const mockData = [
          { id: 1, name: 'AI Solutions GmbH', location: 'Berlin' },
          { id: 2, name: 'Neural Networks AG', location: 'Munich' },
          { id: 3, name: 'Smart Systems Inc.', location: 'Frankfurt' }
        ];
        setCompanies(mockData);
        setFilteredCompanies(mockData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(term.toLowerCase()) || 
      company.location.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredCompanies(filtered);
  };

  return (
    <div className="ki-firmen-container">
      <h1>Ki-Firmen</h1>
      
      <div className="search-container">
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Ki-Firmen..." 
          className="ki-firmen-search"
        />
      </div>
      
      <div className="company-list">
        {filteredCompanies.map(company => (
          <div key={company.id} className="company-card">
            <h3>{company.name}</h3>
            <p>Location: {company.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KiFirmen;
