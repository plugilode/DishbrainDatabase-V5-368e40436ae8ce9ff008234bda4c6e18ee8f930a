"use client";
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

const CompanyDetailsPopup = ({ company, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...company });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

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

  const getCompanyLogo = (domain) => {
    if (!domain) return '/default-company-logo.png';
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
    return `https://logo.clearbit.com/${cleanDomain}`;
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
        <p className="text-gray-200 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-800">
          {value || <span className="text-gray-500">Nicht angegeben</span>}
        </p>
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
        <p className="text-gray-200 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-800 whitespace-pre-wrap">
          {value || <span className="text-gray-500">Nicht angegeben</span>}
        </p>
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

  const renderTabs = () => (
    <div className="flex gap-2 p-4 border-b border-gray-800/50 overflow-x-auto bg-gray-900/50">
      <TabButton id="general" label="Allgemein" icon="info-circle" />
      <TabButton id="ai_tech" label="KI-Technologie" icon="brain" />
      <TabButton id="research" label="Forschung" icon="microscope" />
      <TabButton id="contact" label="Kontakt" icon="address-card" />
      <TabButton id="social" label="Social Media" icon="share-alt" />
      <TabButton id="finance" label="Finanzen" icon="chart-line" />
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
                src={getCompanyLogo(company.domain)}
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
                <button
                  onClick={handleEnrichmentClick}
                  className="px-3 py-1.5 bg-purple-700/80 text-white rounded-lg hover:bg-purple-600/80 transition-colors flex items-center gap-2"
                >
                  {isEnriching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>({Math.round(enrichmentProgress)}%)</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      <span>Anreichern</span>
                    </>
                  )}
                </button>
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

        {renderTabs()}

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

          {/* AI Technology Tab */}
          {activeTab === 'ai_tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">KI-Technologien</h3>
                {renderArrayField('KI-Technologien', 'ai_technologies', 'z.B. Deep Learning, NLP, Computer Vision')}
                {renderArrayField('KI-Anwendungen', 'ai_applications', 'z.B. Bilderkennung, Sprachverarbeitung')}
                {renderInputField('KI-Team-Größe', 'ai_team_size', formData.ai_team_size, 'Anzahl der KI-Entwickler', 'number')}
                {renderTextareaField('KI-Ethik-Richtlinie', 'ai_ethics_policy', formData.ai_ethics_policy, 'KI-Ethik-Richtlinien des Unternehmens')}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">KI-Produkte & Services</h3>
                {renderArrayField('KI-Produkte', 'ai_products', 'Name des KI-Produkts')}
                {renderArrayField('KI-Services', 'ai_services', 'z.B. KI-Beratung, Modellentwicklung')}
                {renderTextareaField('Technische Details', 'ai_technical_details', formData.ai_technical_details, 'Technische Details zu KI-Implementierungen')}
              </div>
            </div>
          )}

          {/* Research Tab */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Forschung & Entwicklung</h3>
                {renderArrayField('Forschungsschwerpunkte', 'research_areas', 'z.B. Reinforcement Learning, Neural Networks')}
                {renderArrayField('Publikationen', 'publications', 'Wissenschaftliche Publikationen')}
                {renderArrayField('Forschungspartner', 'research_partners', 'Namen der Forschungspartner')}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Patente & IP</h3>
                {renderArrayField('Patente', 'patents', 'Name oder Nummer des Patents')}
                {renderTextareaField('IP-Strategie', 'ip_strategy', formData.ip_strategy, 'Details zur IP-Strategie')}
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
        {editMode && (
          <div className="p-4 border-t border-gray-800/50 bg-gray-900/80 flex justify-end gap-3">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPopup;
