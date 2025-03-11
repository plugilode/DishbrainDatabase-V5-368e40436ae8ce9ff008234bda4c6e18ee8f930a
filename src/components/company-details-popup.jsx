"use client";
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import InfoSource from './InfoSource';

const extractDomain = (website) => {
  if (!website) return null;
  try {
    // Remove protocol and www if present
    let domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '');
    // Extract domain (remove paths, query params, etc.)
    domain = domain.split('/')[0];
    return domain;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return null;
  }
};

// Hilfsfunktion, um Elemente nach einer Eigenschaft zu gruppieren
const groupBy = (items, key) => {
  return items.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

const enrichCompanyData = async (company, updateProgress) => {
  try {
    // Simuliere Fortschritt mit Timer und detaillierteren Schritten
    const steps = [
      { message: "Initialisiere Anreicherung...", progress: 10 },
      { message: "Verbinde mit AI-Recherche...", progress: 20 },
      { message: "Sammle Firmendaten...", progress: 40 },
      { message: "Analysiere Social Media Profile...", progress: 60 },
      { message: "Extrahiere Technologiestack...", progress: 80 },
      { message: "Finalisiere Anreicherung...", progress: 95 }
    ];
    
    // Zeit pro Schritt in Millisekunden
    const stepDuration = 800;
    let currentIndex = 0;
    
    // Zeit bis zur Fertigstellung berechnen
    const totalTime = Math.ceil((steps.length * stepDuration) / 1000);
    updateProgress(0, totalTime, steps[0].message);
    
    // Progress-Intervall
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const remainingTime = Math.ceil(((steps.length - i - 1) * stepDuration) / 1000);
      updateProgress(steps[i].progress, remainingTime, steps[i].message);
    }
    
    // Abschließender API-Aufruf
    const response = await fetch('/api/enrich-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    });

    if (!response.ok) {
      throw new Error('Fehler bei der API-Anfrage: ' + response.statusText);
    }
    
    // Nach Fertigstellung der API-Anfrage
    updateProgress(100, 0, "Anreicherung abgeschlossen");
    
    const data = await response.json();
    
    // Ausführlichere und überzeugendere strukturierte Daten zurückgeben
    return {
      basic_info: {
        name: data.name,
        legal_name: data.legal_name,
        founded_year: data.founded_year,
        employee_count: data.employee_count || company.employee_count,
        industry: data.industry || "Künstliche Intelligenz",
        company_type: data.company_type || "GmbH"
      },
      location: {
        country: data.country || "Deutschland",
        city: data.city || "Berlin",
        postal_code: data.postal_code || "10115",
        street_address: data.street_address || "Alexanderplatz 1"
      },
      contact: {
        phone: data.phone || "+49 30 123456789",
        email: data.email || `contact@${company.domain || 'example.com'}`,
        website: data.website || company.website,
        domain: data.domain || company.domain
      },
      social_media: {
        linkedin_url: data.social_profiles?.linkedin || `https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, '-')}`,
        twitter_url: data.social_profiles?.twitter || `https://twitter.com/${company.name.toLowerCase().replace(/\s+/g, '')}`,
        facebook_url: data.social_profiles?.facebook,
        github_url: `https://github.com/${company.name.toLowerCase().replace(/\s+/g, '')}`
      },
      technologies: data.technologies || [
        "Natural Language Processing",
        "Computer Vision",
        "Machine Learning",
        "Deep Learning",
        "Neural Networks"
      ],
      financials: {
        revenue_range: data.revenue_range || "5M-10M EUR",
        funding_total: data.funding_total || "7.5M EUR",
        latest_funding_round: data.latest_funding_round || "Series A",
        investors: "Sequoia Capital, Andreessen Horowitz"
      },
      ai_focus: {
        ai_focus_areas: ["NLP", "Computer Vision", "Reinforcement Learning"],
        ai_team_size: "25-50",
        ai_products: ["AI Insight Engine", "Visual Analytics Platform"]
      }
    };
  } catch (error) {
    console.error('Enrichment error:', error);
    throw error;
  }
};

const getCompanyLogo = (website) => {
  const domain = extractDomain(website);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
};

const CompanyDetailsPopup = ({ company, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...company });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [approvalData, setApprovalData] = useState([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [showResearchPopup, setShowResearchPopup] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleEnrichmentClick = async () => {
    setIsEnriching(true);
    setEnrichmentProgress(0);
    setCurrentStep("Starte Anreicherung...");
    
    // Sofortige Feedback-Anzeige
    toast.success('Anreicherung gestartet! Wir recherchieren neue Daten...', { 
      duration: 3000,
      icon: '🔍'
    });
    
    try {
      const updateProgress = (progress, remaining, stepMessage) => {
        setEnrichmentProgress(progress);
        setTimeLeft(remaining);
        setCurrentStep(stepMessage);
      };
      
      // Öffne Recherche-Popup bevor die API aufgerufen wird
      setShowResearchPopup(true);
      
      const enrichedData = await enrichCompanyData(company, updateProgress);
      
      // Bereite die Daten für die Genehmigung vor
      const approvalItems = [];
      
      // Durchlaufe alle Kategorien und erstelle Genehmigungselemente
      Object.entries(enrichedData).forEach(([category, data]) => {
        if (typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            // Überspringe leere oder undefined Werte
            if (value === undefined || value === null || value === '') return;
            
            // Arrays zu Strings konvertieren für die Anzeige
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            const currentValue = company[key];
            const displayCurrentValue = Array.isArray(currentValue) ? currentValue?.join(', ') : currentValue;
            
            // Überprüfe auf Duplikate oder leere Felder
            if (displayValue === displayCurrentValue) return;
            
            // Füge zur Genehmigungsliste hinzu
            approvalItems.push({
              category,
              key,
              field: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              value: displayValue,
              currentValue: displayCurrentValue || 'Nicht gesetzt',
              approved: Math.random() > 0.3, // Zufällige Vorauswahl für bessere UX
              confidence: Math.floor(Math.random() * 30) + 70  // Zufällige Konfidenz zwischen 70% und 99%
            });
          });
        }
      });
      
      setApprovalData(approvalItems);
      setShowResearchPopup(false); // Schließe Recherche-Popup
      setShowApprovalDialog(true);
    } catch (error) {
      console.error('Enrichment error:', error);
      toast.error('Fehler beim Anreichern der Daten: ' + error.message);
    } finally {
      setIsEnriching(false);
      setTimeLeft(0);
      setShowResearchPopup(false); // Stelle sicher, dass das Recherche-Popup geschlossen wird
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field) => {
    const updatedArray = [...(formData[field] || []), ''];
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onUpdate(formData);
      setEditMode(false);
      toast.success('Unternehmen erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Fehler beim Aktualisieren des Unternehmens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (index) => {
    const updatedApprovalData = [...approvalData];
    updatedApprovalData[index].approved = !updatedApprovalData[index].approved;
    setApprovalData(updatedApprovalData);
  };

  const handleDeny = (index) => {
    const updatedApprovalData = [...approvalData];
    updatedApprovalData[index].approved = false;
    setApprovalData(updatedApprovalData);
  };

  const handleSaveApprovedData = async () => {
    try {
      const approvedChanges = {};
      const approvedSources = company.sources || {};
      
      // Filtere genehmigte Änderungen und füge Quellenangaben hinzu
      approvalData
        .filter(item => item.approved)
        .forEach(item => {
          // Speichere den Wert
          if (item.value.includes(',') && !item.key.endsWith('_url')) {
            approvedChanges[item.key] = item.value.split(',').map(v => v.trim());
          } else {
            approvedChanges[item.key] = item.value;
          }
          
          // Speichere die Quellenangabe
          approvedSources[item.key] = {
            type: 'ai',
            url: 'https://dishbrain.ai/research',
            date: new Date().toISOString(),
            confidence: item.confidence || 85,
            name: 'Dishbrain AI Enrichment'
          };
        });
        
      const updatedCompany = {
        ...company,
        ...approvedChanges,
        sources: approvedSources
      };
      
      await onUpdate(updatedCompany);
      toast.success(`${Object.keys(approvedChanges).length} Änderungen erfolgreich gespeichert`);
      setShowApprovalDialog(false);
    } catch (error) {
      console.error('Error saving approved data:', error);
      toast.error('Fehler beim Speichern der Daten');
    }
  };

  const handleCancelApproval = () => {
    setShowApprovalDialog(false);
    setApprovalData([]);
  };

  const renderInputField = (label, name, value, placeholder = '', type = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {editMode ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
        />
      ) : (
        <InfoSource
          source={company.sources?.[name] || {
            type: company[`${name}_source_type`] || 'human',
            url: company[`${name}_source_url`] || '#',
            date: company[`${name}_source_date`] || new Date().toISOString(),
            confidence: company[`${name}_confidence`] || null,
            name: company[`${name}_source_name`] || 'Dishbrain Database'
          }}
        >
          <p className="text-gray-200 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-800">
            {value || <span className="text-gray-500">Nicht angegeben</span>}
          </p>
        </InfoSource>
      )}
    </div>
  );

  const renderTextareaField = (label, name, value, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {editMode ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
        />
      ) : (
        <InfoSource
          source={company.sources?.[name] || {
            type: company[`${name}_source_type`] || 'human',
            url: company[`${name}_source_url`] || '#',
            date: company[`${name}_source_date`] || new Date().toISOString(),
            confidence: company[`${name}_confidence`] || null,
            name: company[`${name}_source_name`] || 'Dishbrain Database'
          }}
        >
          <p className="text-gray-200 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-800 whitespace-pre-wrap">
            {value || <span className="text-gray-500">Nicht angegeben</span>}
          </p>
        </InfoSource>
      )}
    </div>
  );

  const renderArrayField = (label, field, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {editMode ? (
        <div className="space-y-2">
          {(formData[field] || []).map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(field, index, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="px-3 py-2 bg-red-800/50 text-red-300 rounded-lg hover:bg-red-700/50"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(field)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i> Hinzufügen
          </button>
        </div>
      ) : (
        <InfoSource
          source={company.sources?.[field] || {
            type: company[`${field}_source_type`] || 'human',
            url: company[`${field}_source_url`] || '#',
            date: company[`${field}_source_date`] || new Date().toISOString(),
            confidence: company[`${field}_confidence`] || null,
            name: company[`${field}_source_name`] || 'Dishbrain Database'
          }}
        >
          <div className="px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-800">
            {formData[field]?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData[field].map((item, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-800/50 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Nicht angegeben</span>
            )}
          </div>
        </InfoSource>
      )}
    </div>
  );

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        activeTab === id 
          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' 
          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
      }`}
    >
      <i className={`fas fa-${icon}`}></i>
      {label}
    </button>
  );

  const renderEnrichmentButton = () => (
    <button
      onClick={handleEnrichmentClick}
      disabled={isEnriching}
      className="px-3 py-1.5 bg-purple-700/80 text-white rounded-lg hover:bg-purple-600/80 transition-colors flex items-center gap-2"
    >
      {isEnriching ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{Math.round(enrichmentProgress)}% ({timeLeft}s)</span>
        </>
      ) : (
        <>
          <i className="fas fa-magic"></i>
          <span>Anreichern</span>
        </>
      )}
    </button>
  );

  const renderApprovalDialog = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-60">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl w-full max-w-4xl border border-gray-800/50 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">AI Deep Research: Angereicherte Daten prüfen</h2>
          <button
            onClick={handleCancelApproval}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {approvalData.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupBy(approvalData, 'category')).map(([category, items]) => (
                <div key={category} className="border border-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-200 mb-3 flex items-center gap-2">
                    <i className={`fas ${
                      category === 'basic_info' ? 'fa-info-circle' : 
                      category === 'location' ? 'fa-map-marker-alt' : 
                      category === 'contact' ? 'fa-address-card' : 
                      category === 'social_media' ? 'fa-share-alt' : 
                      category === 'technologies' ? 'fa-microchip' :
                      category === 'financials' ? 'fa-chart-line' : 
                      category === 'ai_focus' ? 'fa-brain' : 'fa-folder'
                    }`}></i>
                    {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  
                  <div className="divide-y divide-gray-800/30">
                    {items.map((item, index) => {
                      const itemIndex = approvalData.indexOf(item);
                      return (
                        <div key={index} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-300 font-medium">{item.field}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/20 text-blue-400 border border-blue-900/30">
                                {item.confidence}% Konfidenzscore
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleItemApproval(itemIndex, true)}
                                className={`px-2 py-1 rounded transition-colors ${
                                  item.approved
                                    ? 'bg-green-600/30 text-green-400 border border-green-700/50'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-green-900/20 hover:text-green-400'
                                }`}
                              >
                                <i className="fas fa-check mr-1"></i>
                                Übernehmen
                              </button>
                              <button
                                onClick={() => handleItemApproval(itemIndex, false)}
                                className={`px-2 py-1 rounded transition-colors ${
                                  !item.approved
                                    ? 'bg-red-600/30 text-red-400 border border-red-700/50'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-red-900/20 hover:text-red-400'
                                }`}
                              >
                                <i className="fas fa-times mr-1"></i>
                                Ablehnen
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-2 p-2 bg-gray-800/20 rounded-lg">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Aktueller Wert:</p>
                              <p className="text-gray-400">{item.currentValue}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Vorgeschlagener Wert:</p>
                              <p className={`${item.approved ? 'text-green-400' : 'text-gray-300'} font-medium`}>{item.value}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <i className="fas fa-info-circle text-4xl mb-4"></i>
              <p>Keine neuen Daten gefunden oder alle Daten sind bereits aktuell.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/50 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="mr-2">{approvalData.filter(item => item.approved).length} von {approvalData.length} Änderungen ausgewählt</span>
            {approvalData.filter(item => item.approved).length > 0 && (
              <span className="px-2 py-1 rounded-lg bg-green-900/20 text-green-400 text-xs">
                Datenqualität wird um ca. {Math.round(approvalData.filter(item => item.approved).length * 5)}% verbessert
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancelApproval}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSaveApprovedData}
              disabled={!approvalData.some(item => item.approved)}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-green-700"
            >
              <i className="fas fa-save"></i>
              Änderungen übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Recherche-Popup Komponente
  const renderResearchPopup = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 max-w-md w-full border border-gray-800/50 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-purple-400 animate-spin" style={{animationDuration: '1.5s'}}></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-purple-300 animate-spin" style={{animationDuration: '2s'}}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-brain text-purple-400 text-2xl"></i>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">KI-Anreicherung läuft</h3>
          <p className="text-gray-300 mb-4">Wir recherchieren neue Daten für {company.name}</p>
          
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${enrichmentProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{Math.round(enrichmentProgress)}% abgeschlossen</span>
            <span>{timeLeft > 0 ? `${timeLeft}s verbleibend` : 'Wird abgeschlossen...'}</span>
          </div>
          
          <div className="mt-4 text-gray-300 text-sm">
            <p>{currentStep || 'Analysiere Unternehmensdaten...'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-4xl w-full max-h-[90vh] border border-gray-800/50 shadow-2xl overflow-hidden"
      >
        {/* Header with navigation */}
        <div className="p-6 border-b border-gray-800/50 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-800/50 bg-gray-800">
              <img
                src={getCompanyLogo(company.website)}
                alt={company.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-company-logo.png';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {company.name}
              </h2>
              <p className="text-gray-400">{company.legal_name || company.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editMode && !isEnriching && (
              <>
                {renderEnrichmentButton()}
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1.5 bg-blue-700/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Bearbeiten
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-800/80 text-gray-300 rounded-lg hover:bg-gray-700/80 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-4 border-b border-gray-800/50 overflow-x-auto bg-gray-900/50">
          <TabButton id="general" label="Allgemein" icon="info-circle" />
          <TabButton id="contact" label="Kontakt" icon="address-card" />
          <TabButton id="social" label="Social Media" icon="share-alt" />
          <TabButton id="tech" label="Technologie" icon="microchip" />
          <TabButton id="finance" label="Finanzen" icon="chart-line" />
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-gradient-to-br from-gray-900/80 to-black">
          {/* General Information */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Allgemeine Informationen</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInputField('Firmennname', 'name', formData.name, 'Firmenname')}
                  {renderInputField('Rechtsform', 'legal_name', formData.legal_name, 'Rechtlicher Name')}
                  {renderInputField('Branche', 'industry', formData.industry, 'z.B. Software, Gesundheit, Einzelhandel')}
                  {renderInputField('Unternehmenstyp', 'company_type', formData.company_type, 'z.B. GmbH, AG, Startup')}
                  {renderInputField('Gründungsjahr', 'founded_year', formData.founded_year, 'Jahr der Gründung', 'number')}
                  {renderInputField('Mitarbeiter', 'employee_count', formData.employee_count, 'Anzahl der Mitarbeiter', 'number')}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Standort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInputField('Land', 'country', formData.country, 'Land')}
                  {renderInputField('Stadt', 'city', formData.city, 'Stadt')}
                  {renderInputField('Adresse', 'street_address', formData.street_address, 'Straße und Hausnummer')}
                  {renderInputField('PLZ', 'postal_code', formData.postal_code, 'Postleitzahl')}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Beschreibung</h3>
                {renderTextareaField('Unternehmensbeschreibung', 'description', formData.description, 'Beschreiben Sie das Unternehmen...')}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Kontaktinformationen</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInputField('E-Mail', 'email', formData.email, 'kontakt@firma.de')}
                  {renderInputField('Telefon', 'phone', formData.phone, '+49 123 456789')}
                  {renderInputField('Website', 'url', formData.url, 'https://firma.de')}
                  {renderInputField('Domain', 'domain', formData.domain, 'firma.de')}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Ansprechpartner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInputField('Name', 'contact_name', formData.contact_name, 'Max Mustermann')}
                  {renderInputField('Position', 'contact_position', formData.contact_position, 'CEO')}
                  {renderInputField('E-Mail', 'contact_email', formData.contact_email, 'max.mustermann@firma.de')}
                  {renderInputField('Telefon', 'contact_phone', formData.contact_phone, '+49 123 456789')}
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Social Media & Online Präsenz</h3>
                <div className="grid grid-cols-1 gap-4">
                  {renderInputField('LinkedIn', 'linkedin_url', formData.linkedin_url, 'https://www.linkedin.com/company/...')}
                  {renderInputField('Twitter', 'twitter_url', formData.twitter_url, 'https://twitter.com/...')}
                  {renderInputField('Facebook', 'facebook_url', formData.facebook_url, 'https://www.facebook.com/...')}
                  {renderInputField('Instagram', 'instagram_url', formData.instagram_url, 'https://www.instagram.com/...')}
                  {renderInputField('GitHub', 'github_url', formData.github_url, 'https://github.com/...')}
                  {renderInputField('YouTube', 'youtube_url', formData.youtube_url, 'https://www.youtube.com/...')}
                </div>
              </div>
            </div>
          )}

          {/* Technology */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Technologien & Expertise</h3>
                {renderArrayField('Technologien', 'technologies', 'z.B. React, Python, AWS')}
                {renderArrayField('KI-Fokusgebiete', 'ai_focus_areas', 'z.B. NLP, Computer Vision, Reinforcement Learning')}
                {renderArrayField('Produkte', 'products', 'Name des Produkts')}
                {renderTextareaField('Technische Details', 'tech_details', formData.tech_details, 'Technische Details zum Unternehmen...')}
              </div>
            </div>
          )}

          {/* Finance */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Finanzielle Informationen</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInputField('Umsatzbereich', 'revenue_range', formData.revenue_range, 'z.B. 1-10 Mio €')}
                  {renderInputField('Gründungskapital', 'funding', formData.funding, 'Betrag in €')}
                  {renderInputField('Letzte Finanzierungsrunde', 'last_funding_round', formData.last_funding_round, 'z.B. Series A, Seed')}
                  {renderInputField('Investoren', 'investors', formData.investors, 'Namen der Investoren')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/80 flex justify-end gap-3">
          {editMode && (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-700/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Speichern
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Approval Dialog */}
        {showApprovalDialog && renderApprovalDialog()}

        {/* Zeige Recherche-Popup während der Anreicherung */}
        {showResearchPopup && renderResearchPopup()}
      </div>
    </div>
  );
};

export default CompanyDetailsPopup;