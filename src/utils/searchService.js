/**
 * Service für die Expertensuche mit Autovervollständigung
 */

/**
 * Sucht nach Experten mit den angegebenen Kriterien
 * 
 * @param {string} query - Die Suchanfrage
 * @param {string} filter - Der Filter (all, tags, name, usw.)
 * @param {number} limit - Maximale Anzahl von Ergebnissen
 * @returns {Promise<Object>} - Gefilterte Experten und Gesamtzahl
 */
export async function searchExperts(query, filter = 'all', limit = 20) {
  try {
    const params = new URLSearchParams({
      q: query,
      filter,
      limit: limit.toString(),
      mode: 'search'
    });
    
    const response = await fetch(`/api/search/experts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search experts error:', error);
    throw error;
  }
}

/**
 * Ruft Autovervollständigungsvorschläge für die Suche ab
 * 
 * @param {string} query - Die Suchanfrage
 * @param {string} filter - Der Filter (all, tags, name, usw.)
 * @returns {Promise<Array>} - Vorschläge für die Autovervollständigung
 */
export async function getAutocompleteSuggestions(query, filter = 'all') {
  if (!query || query.length < 2) {
    return { suggestions: [] };
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      filter,
      mode: 'autocomplete'
    });
    
    const response = await fetch(`/api/search/experts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Autocomplete error:', error);
    return { suggestions: [] };
  }
}

/**
 * Stuft die Suchergebnisse nach Relevanz ein
 * 
 * @param {Array} experts - Die Liste der Experten
 * @param {string} query - Die Suchanfrage
 * @returns {Array} - Nach Relevanz sortierte Experten
 */
export function rankSearchResults(experts, query) {
  if (!query) return experts;
  
  const lowercaseQuery = query.toLowerCase();
  
  return experts.map(expert => {
    // Berechne Relevanzscore basierend auf verschiedenen Faktoren
    let relevanceScore = 0;
    
    // Name-Übereinstimmung gibt hohen Score
    const fullName = expert.personalInfo?.fullName || expert.name || '';
    if (fullName.toLowerCase().includes(lowercaseQuery)) {
      relevanceScore += 10;
      // Exakte Übereinstimmung gibt noch mehr Punkte
      if (fullName.toLowerCase() === lowercaseQuery) {
        relevanceScore += 5;
      }
    }
    
    // Expertise-Übereinstimmung
    if (Array.isArray(expert.expertise)) {
      expert.expertise.forEach(exp => {
        if (exp.toLowerCase().includes(lowercaseQuery)) {
          relevanceScore += 5;
        }
      });
    } else if (expert.expertise?.primary) {
      expert.expertise.primary.forEach(exp => {
        if (exp.toLowerCase().includes(lowercaseQuery)) {
          relevanceScore += 5;
        }
      });
    }
    
    // Tags-Übereinstimmung
    if (Array.isArray(expert.tags)) {
      expert.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowercaseQuery)) {
          relevanceScore += 3;
        }
      });
    }
    
    // Position und Organisation geben zusätzliche Punkte
    const position = expert.position || expert.currentRole?.title || '';
    if (position.toLowerCase().includes(lowercaseQuery)) {
      relevanceScore += 2;
    }
    
    const organization = expert.organisation || expert.currentRole?.organization || '';
    if (organization.toLowerCase().includes(lowercaseQuery)) {
      relevanceScore += 2;
    }
    
    return {
      ...expert,
      relevanceScore
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}
