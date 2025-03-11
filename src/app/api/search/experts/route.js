import { NextResponse } from 'next/server';

/**
 * API-Route für die Expertensuche mit Autovervollständigung
 * 
 * @param {Request} request - Die HTTP-Anfrage
 * @returns {NextResponse} - HTTP-Antwort mit den gefilterten Experten oder Vorschlägen
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const mode = url.searchParams.get('mode') || 'search'; // 'search' oder 'autocomplete'
    const filter = url.searchParams.get('filter') || 'all'; // 'all', 'tags', 'name', usw.
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Experten aus der Datenquelle laden
    // In einer echten Anwendung würde hier eine DB-Abfrage stehen
    const experts = loadExpertsFromSource();
    
    // Je nach Modus unterschiedliche Ergebnisse zurückgeben
    if (mode === 'autocomplete') {
      const suggestions = generateAutocompleteSuggestions(query, filter, experts);
      return NextResponse.json({ suggestions }, { status: 200 });
    } else {
      const results = searchExperts(query, filter, experts, limit);
      return NextResponse.json({ results, total: results.length }, { status: 200 });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Suche', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * Lädt Experten aus der Datenquelle
 * In einer echten Anwendung würde dies aus einer DB erfolgen
 */
function loadExpertsFromSource() {
  // Simuliere das Laden aus einer Datenbank
  // In einer echten Anwendung würde hier die DB-Abfrage stehen
  try {
    if (typeof window !== 'undefined') {
      const experts = JSON.parse(localStorage.getItem('experts')) || [];
      return experts;
    }
    return []; // Fallback für serverseitige Ausführung
  } catch (error) {
    console.error('Error loading experts:', error);
    return [];
  }
}

/**
 * Generiert Autovervollständigungsvorschläge basierend auf der Anfrage
 * 
 * @param {string} query - Die Suchanfrage
 * @param {string} filter - Der Filter (all, tags, name, usw.)
 * @param {Array} experts - Die Liste der Experten
 * @returns {Array} - Liste von Vorschlägen
 */
function generateAutocompleteSuggestions(query, filter, experts) {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  let allTags = new Set();
  let allExpertise = new Set();
  let allNames = new Set();
  
  // Sammle alle Tags, Expertise und Namen
  experts.forEach(expert => {
    // Tags sammeln
    if (Array.isArray(expert.tags)) {
      expert.tags.forEach(tag => allTags.add(tag));
    }
    
    // Expertise sammeln 
    if (Array.isArray(expert.expertise)) {
      expert.expertise.forEach(item => allExpertise.add(item));
    } else if (expert.expertise?.primary) {
      expert.expertise.primary.forEach(item => allExpertise.add(item));
    }
    
    // Namen sammeln
    const name = expert.personalInfo?.fullName || expert.name || '';
    if (name) allNames.add(name);
  });
  
  // Filtern nach Suchanfrage
  let suggestions = [];
  
  if (filter === 'all' || filter === 'tags') {
    const matchingTags = Array.from(allTags)
      .filter(tag => tag.toLowerCase().includes(lowercaseQuery))
      .map(tag => ({ value: tag, type: 'tag' }));
    suggestions = [...suggestions, ...matchingTags];
  }
  
  if (filter === 'all' || filter === 'expertise') {
    const matchingExpertise = Array.from(allExpertise)
      .filter(expertise => expertise.toLowerCase().includes(lowercaseQuery))
      .map(expertise => ({ value: expertise, type: 'expertise' }));
    suggestions = [...suggestions, ...matchingExpertise];
  }
  
  if (filter === 'all' || filter === 'name') {
    const matchingNames = Array.from(allNames)
      .filter(name => name.toLowerCase().includes(lowercaseQuery))
      .map(name => ({ value: name, type: 'name' }));
    suggestions = [...suggestions, ...matchingNames];
  }
  
  // Limitiere die Ergebnisse und sortiere sie nach Relevanz
  return suggestions
    .sort((a, b) => {
      // Priorisiere Einträge, die mit dem Suchbegriff beginnen
      const aStartsWith = a.value.toLowerCase().startsWith(lowercaseQuery);
      const bStartsWith = b.value.toLowerCase().startsWith(lowercaseQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Danach alphabetisch sortieren
      return a.value.localeCompare(b.value);
    })
    .slice(0, 10); // Maximal 10 Vorschläge
}

/**
 * Sucht nach Experten basierend auf der Anfrage
 * 
 * @param {string} query - Die Suchanfrage
 * @param {string} filter - Der Filter (all, tags, name, usw.)
 * @param {Array} experts - Die Liste der Experten
 * @param {number} limit - Maximale Anzahl von Ergebnissen
 * @returns {Array} - Gefilterte Experten
 */
function searchExperts(query, filter, experts, limit) {
  if (!query) return experts.slice(0, limit);
  
  const lowercaseQuery = query.toLowerCase();
  
  // Verschiedene Suchfilter anwenden
  return experts
    .filter(expert => {
      // Bei leerem Query alle zurückgeben
      if (!query) return true;
      
      // Nach Name suchen
      if (filter === 'all' || filter === 'name') {
        const fullName = expert.personalInfo?.fullName || expert.name || '';
        if (fullName.toLowerCase().includes(lowercaseQuery)) return true;
      }
      
      // Nach Tags suchen
      if (filter === 'all' || filter === 'tags') {
        if (Array.isArray(expert.tags) && expert.tags.some(tag => 
          tag.toLowerCase().includes(lowercaseQuery)
        )) return true;
      }
      
      // Nach Expertise suchen
      if (filter === 'all' || filter === 'expertise') {
        if (Array.isArray(expert.expertise)) {
          if (expert.expertise.some(exp => exp.toLowerCase().includes(lowercaseQuery))) return true;
        } else if (expert.expertise?.primary) {
          if (expert.expertise.primary.some(exp => exp.toLowerCase().includes(lowercaseQuery))) return true;
        }
      }
      
      // Nach Position suchen
      if (filter === 'all' || filter === 'position') {
        const position = expert.position || expert.currentRole?.title || '';
        if (position.toLowerCase().includes(lowercaseQuery)) return true;
      }
      
      // Nach Organisation suchen
      if (filter === 'all' || filter === 'organization') {
        const organization = expert.organisation || expert.currentRole?.organization || '';
        if (organization.toLowerCase().includes(lowercaseQuery)) return true;
      }
      
      return false;
    })
    .slice(0, limit);
}
