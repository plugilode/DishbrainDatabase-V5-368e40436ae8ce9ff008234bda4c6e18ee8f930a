/**
 * Utility-Funktionen zum Verwalten von Agent-Forschungsergebnissen (Findings)
 */

// Lade gespeicherte Findings aus dem localStorage oder gibt leeres Array zurück
export const loadFindings = () => {
  try {
    if (typeof window === 'undefined') return [];
    
    const storedFindings = localStorage.getItem('agentFindings');
    return storedFindings ? JSON.parse(storedFindings) : [];
  } catch (error) {
    console.error('Error loading findings from localStorage:', error);
    return [];
  }
};

// Speichere Findings im localStorage
export const saveFindings = (findings) => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.setItem('agentFindings', JSON.stringify(findings));
    return true;
  } catch (error) {
    console.error('Error saving findings to localStorage:', error);
    return false;
  }
};

// Speichere genehmigte Findings in der JSON-Datenbank
// In einer echten Anwendung würde dies eine API-Anfrage sein
export const saveApprovedFindingsToDatabase = async (findings) => {
  try {
    if (typeof window === 'undefined') return { success: false, error: 'Browser environment required' };
    
    // Simuliere einen API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Speichere genehmigte Findings in einem separaten localStorage-Schlüssel
    // Dies simuliert eine Datenbank-Speicherung
    const approvedFindings = findings.filter(finding => finding.approved);
    localStorage.setItem('approvedFindingsDatabase', JSON.stringify(approvedFindings));
    
    console.log('Findings saved to database:', approvedFindings);
    return {
      success: true,
      count: approvedFindings.length
    };
  } catch (error) {
    console.error('Error saving findings to database:', error);
    throw new Error('Failed to save findings to database');
  }
};

// Generiere neue Mock-Findings für Demo-Zwecke
export const generateMockFindings = (expertsList, count = 3) => {
  const findingTypes = ['Publication', 'Patent', 'Collaboration', 'Award', 'Conference', 'Research'];
  const mockSources = [
    'https://arxiv.org/papers/ai-research-2023',
    'https://ai-journal.com/publications/recent',
    'https://patents.org/recent/ai',
    'https://conferences.ai/proceedings',
    'https://research-collaborations.org/ai'
  ];
  
  const mockContents = [
    'Published new research on improving transformer models for NLP',
    'Filed patent for novel approach to edge computing with neural networks',
    'Started collaboration with Stanford University on AI ethics research',
    'Received outstanding researcher award from European AI Society',
    'Presented breakthrough findings on computer vision at CVPR 2023',
    'Developed new algorithm for efficient resource allocation in distributed AI systems',
    'Published comparative study of quantum approaches to machine learning',
    'Launched a new AI ethics course for graduate students',
    'Published a critical assessment of large language models in healthcare',
    'Designed novel algorithm for reducing computational complexity in transformer models',
    'Received major grant for research on explainable AI in medical diagnoses'
  ];
  
  // Erweiterte related data für detailliertere Findings
  const mockRelatedData = [
    {
      citations: 23,
      coAuthors: ["Dr. Sarah Chen", "Prof. James Miller", "Dr. Anna Kovacs"],
      abstract: "This paper introduces a novel approach to transformer-based neural networks that significantly reduces computational complexity while maintaining performance parity with state-of-the-art models."
    },
    {
      patentNumber: "EP3472281A1",
      inventors: ["Klaus Müller", "Maria Schmidt", "Tomas Garcia"],
      commercialization: "Licensed to EdgeAI Technologies GmbH"
    },
    {
      institutionDetails: "Stanford Center for AI Safety",
      fundingAmount: "€2.4 million",
      duration: "2023-2026",
      keyObjectives: ["Establish ethical guidelines", "Develop testing frameworks", "Create educational materials"]
    },
    null
  ];
  
  const randomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };
  
  const newFindings = [];
  
  for (let i = 0; i < count; i++) {
    // Wähle zufälligen Experten oder verwende einen Standard-Namen
    const randomExpert = expertsList && expertsList.length > 0 
      ? expertsList[Math.floor(Math.random() * expertsList.length)]
      : null;
    
    const expertName = randomExpert 
      ? (randomExpert.name || randomExpert.fullName || `Expert ${i+1}`)
      : `Expert ${i+1}`;
    
    const randomRelatedData = mockRelatedData[Math.floor(Math.random() * mockRelatedData.length)];
    
    newFindings.push({
      id: `finding-${Date.now()}-${i}`,
      expert: expertName,
      type: findingTypes[Math.floor(Math.random() * findingTypes.length)],
      content: mockContents[Math.floor(Math.random() * mockContents.length)],
      source: mockSources[Math.floor(Math.random() * mockSources.length)],
      date: randomDate(),
      approved: false,
      rejected: false,
      relevance: (Math.random() * 0.3) + 0.7, // Relevanz zwischen 0.7 und 1.0
      relatedData: randomRelatedData
    });
  }
  
  return newFindings;
};

// Detaillierte Analyse eines Findings für die Bewertung
export const analyzeFinding = (finding) => {
  // Simulierte Analyse des Findings durch den Agenten
  const analysisScore = finding.relevance * 100;
  let recommendation = '';
  
  if (analysisScore > 90) {
    recommendation = 'High priority - approve and integrate immediately';
  } else if (analysisScore > 80) {
    recommendation = 'Important finding - recommend approval';
  } else if (analysisScore > 70) {
    recommendation = 'Relevant finding - consider approval';
  } else {
    recommendation = 'Low priority - review manually';
  }
  
  return {
    score: analysisScore,
    recommendation,
    keywords: extractKeywords(finding),
    validationStatus: 'Verified',
    confidenceScore: Math.round(finding.relevance * 95) + '%'
  };
};

// Extrahiere Keywords aus dem Finding-Inhalt
const extractKeywords = (finding) => {
  // In einer echten Anwendung würde hier NLP verwendet werden
  const commonKeywords = [
    'AI', 'machine learning', 'neural networks', 'ethics', 'transformer',
    'research', 'deep learning', 'patent', 'publication', 'algorithm',
    'healthcare', 'computer vision', 'NLP', 'robotics', 'edge computing'
  ];
  
  // Wähle zufällig 2-5 Keywords aus
  const keywordCount = 2 + Math.floor(Math.random() * 4);
  const keywords = [];
  
  for (let i = 0; i < keywordCount; i++) {
    const randomKeyword = commonKeywords[Math.floor(Math.random() * commonKeywords.length)];
    if (!keywords.includes(randomKeyword)) {
      keywords.push(randomKeyword);
    }
  }
  
  return keywords;
};
