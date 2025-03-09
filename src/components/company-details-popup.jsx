"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import CompanyResearchPopup from './company-research-popup';
import { extractDomain } from '../utils/extractDomain';

const enrichCompanyData = async (company, updateProgress) => {
  try {
    const domain = extractDomain(company.website);

    // Simulate enrichment process with progress updates
    let progress = 0;
    const totalSteps = 5;
    const stepTime = 1000; // 1 second per step

    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepTime));
      progress = (i / totalSteps) * 100;
      updateProgress(progress, ((totalSteps - i) * stepTime) / 1000);
    }

    // Fetch enrichment data from the API
    const response = await fetch('/api/enrich-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company: {
          name: company.name,
          website: company.website,
          domain: domain,
        },
        options: {
          companyInfo: true,
          socialMedia: true,
          technologies: true,
          products: true,
          financials: true,
        },
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch enrichment data from the API');
    }
    const data = await response.json();
    return data;
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

const CompanyDetailsPopup = ({ company, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState({ ...company });
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('Information');
  const [approvalData, setApprovalData] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleEnrichmentClick = async () => {
    try {
      setIsEnriching(true);
      setEnrichmentProgress(0);
      setEstimatedTimeLeft(0);

      const updateProgress = (progress, timeLeft) => {
        setEnrichmentProgress(progress);
        setEstimatedTimeLeft(timeLeft);
      };

      const enrichedData = await enrichCompanyData(company, updateProgress);

      // Prepare data for approval
      const approvalItems = Object.keys(enrichedData).map((key) => ({
        key,
        value: enrichedData[key],
        approved: true,
      }));
      setApprovalData(approvalItems);
      setShowApprovalModal(true);
    } catch (error) {
      console.error('Enrichment error:', error);
      toast.error('Fehler bei der Anreicherung mit dem API');
    } finally {
      setIsEnriching(false);
    }
  };

  const handleApprove = (index) => {
    const newData = [...approvalData];
    newData[index].approved = true;
    setApprovalData(newData);
  };

  const handleDeny = (index) => {
    const newData = [...approvalData];
    newData[index].approved = false;
    setApprovalData(newData);
  };

  const handleSaveApproval = async () => {
    try {
      const approvedData = approvalData
        .filter((item) => item.approved)
        .reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});

      const updatedCompany = {
        ...company,
        ...approvedData,
      };

      await onUpdate(updatedCompany);
      toast.success('Enrichment-Daten gespeichert');
      setShowApprovalModal(false);
    } catch (error) {
      console.error('Error saving approved data:', error);
      toast.error('Fehler beim Speichern der Enrichment-Daten');
    }
  };

  const handleCancelApproval = () => {
    setShowApprovalModal(false);
  };

  const handleSave = async () => {
  try {
    await onUpdate(editedCompany);
    setIsEditing(false);
    toast.success('Änderungen gespeichert');
  } catch (error) {
    console.error('Error saving changes:', error);
    toast.error('Fehler beim Speichern der Änderungen');
  }
};

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const domain = extractDomain(company.website);
      const response = await fetch(`/api/companies?domain=${domain}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      toast.success('Firma erfolgreich gelöscht');
      onClose();
      onDelete(company);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Löschen fehlgeschlagen: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    'Information',
    'KI-News',
    'Enrichment Result',
    'Documents',
    'Members',
  ];

  const logoUrl = getCompanyLogo(company.website);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-lg">
        {/* Header with logo and company name */}
        <div className="flex items-start mb-6">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${company.name} Logo`}
              className="w-24 h-24 object-contain mr-6"
            />
          )}
          <div>
            <h2 className="text-3xl font-semibold">{company.name}</h2>
            {company.industry && (
              <p className="text-gray-800 dark:text-gray-400 mt-1">{company.industry}</p>
            )}
            {company.revenue_range && (
              <p className="text-gray-800 dark:text-gray-400">{`Umsatz: ${company.revenue_range}`}</p>
            )}
            {company.employee_count && (
              <p className="text-gray-800 dark:text-gray-400">{`Mitarbeiter: ${company.employee_count}`}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            {isEditing ? 'Abbrechen' : 'Bearbeiten'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Speichern
            </button>
          )}
          <button
            onClick={handleEnrichmentClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            disabled={isEnriching}
          >
            {isEnriching ? 'Anreicherung...' : 'Enrichment'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Löschen
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
          >
            Schließen
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-4 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'Information' && (
            <div className="space-y-6">
              {/* Company Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Beschreibung</h3>
                <p className="text-gray-800 dark:text-gray-300">
                  {company.description || 'Keine Beschreibung verfügbar.'}
                </p>
              </div>

              {/* Contact Information */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <h4 className="font-medium text-black">Website:</h4>
    {isEditing ? (
      <input
        type="text"
        value={editedCompany.website}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, website: e.target.value })
        }
        className="text-black"
      />
    ) : company.website ? (
      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        {company.website}
      </a>
    ) : (
      <span className="text-gray-400">Nicht verfügbar</span>
    )}
  </div>
  <div>
    <h4 className="font-medium text-black">E-Mail:</h4>
    {isEditing ? (
      <input
        type="email"
        value={editedCompany.email}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, email: e.target.value })
        }
        className="text-black"
      />
    ) : company.email ? (
      <a
        href={`mailto:${company.email}`}
        className="text-blue-400 hover:underline"
      >
        {company.email}
      </a>
    ) : (
      <span className="text-gray-400">Nicht verfügbar</span>
    )}
  </div>
  <div>
    <h4 className="font-medium text-black">Telefon:</h4>
    {isEditing ? (
      <input
        type="text"
        value={editedCompany.phone}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, phone: e.target.value })
        }
        className="text-black"
      />
    ) : (
      <span className="text-gray-800 dark:text-gray-300">
        {company.phone || 'Nicht verfügbar'}
      </span>
    )}
  </div>
  <div>
    <h4 className="font-medium text-black">Adresse:</h4>
    {isEditing ? (
      <input
        type="text"
        value={editedCompany.address}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, address: e.target.value })
        }
        className="text-black"
      />
    ) : (
      <span className="text-gray-800 dark:text-gray-300">
        {company.address ||
          `${company.street_address || ''}, ${company.city || ''}, ${
            company.state || ''
          } ${company.postal_code || ''}, ${company.country || ''}`}
      </span>
    )}
  </div>
  <div>
    <h4 className="font-medium text-black">Branche:</h4>
    {isEditing ? (
      <input
        type="text"
        value={editedCompany.industry}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, industry: e.target.value })
        }
        className="text-black"
      />
    ) : (
      <span className="text-gray-800 dark:text-gray-300">
        {company.industry || 'Nicht verfügbar'}
      </span>
    )}
  </div>
  <div>
    <h4 className="font-medium text-black">Gründungsjahr:</h4>
    {isEditing ? (
      <input
        type="text"
        value={editedCompany.founded_year}
        onChange={(e) =>
          setEditedCompany({ ...editedCompany, founded_year: e.target.value })
        }
        className="text-black"
      />
    ) : (
      <span className="text-gray-800 dark:text-gray-300">
        {company.founded_year || 'Nicht verfügbar'}
      </span>
    )}
  </div>
</div>

              {/* Additional Information */}
              <div>
                <h4 className="font-medium text-black">CEO:</h4>
                <span className="text-gray-800 dark:text-gray-300">
                  {company.ceo || 'Nicht verfügbar'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-black">Gründungsdatum:</h4>
                <span className="text-gray-800 dark:text-gray-300">
                  {company.founded_date || 'Nicht verfügbar'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-black">Hauptsitz:</h4>
                <span className="text-gray-800 dark:text-gray-300">
                  {company.headquarters || 'Nicht verfügbar'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-black">Marktwert:</h4>
                <span className="text-gray-800 dark:text-gray-300">
                  {company.market_value || 'Nicht verfügbar'}
                </span>
              </div>

              {company.technologies && company.technologies.length > 0 && (
                <div>
                  <h4 className="font-medium text-black">Technologien:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {company.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {company.products && company.products.length > 0 && (
                <div>
                  <h4 className="font-medium text-black">Produkte:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {company.products.map((product, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {company.services && company.services.length > 0 && (
                <div>
                  <h4 className="font-medium text-black">Dienstleistungen:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {company.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other tabs content */}
          {activeTab === 'News' && (
            <div>
              {/* News content */}
              <p className="text-gray-800 dark:text-gray-300">Keine Neuigkeiten verfügbar.</p>
            </div>
          )}
          {activeTab === 'Enrichment Result' && (
            <div className="space-y-4">
              {/* Enrichment Result content */}
              {(() => {
                const entries = Object.entries(company.ai_enrichment || {});
                const uniqueEntries = entries.reduce((acc, [key, value]) => {
                  if (acc[key]) {
                    acc[key] = `${acc[key]}, ${value}`;
                    toast.warn(`Duplicate key found: ${key}. Values have been merged.`);
                  } else {
                    acc[key] = value;
                  }
                  return acc;
                }, {});

                return Object.entries(uniqueEntries)
                  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                  .map(([key, value]) => (
                    <button
                      key={key}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full mb-2"
                    >
                      {key}: {String(value)}
                    </button>
                  ));
              })()}
            </div>
          )}
          {activeTab === 'Documents' && (
            <div>
              {/* Documents content */}
              <p className="text-gray-800 dark:text-gray-300">Keine Dokumente verfügbar.</p>
            </div>
          )}
          {activeTab === 'Members' && (
            <div>
              {/* Members content */}
              <p className="text-gray-800 dark:text-gray-300">Keine Mitglieder verfügbar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enrichment progress modal */}
      {isEnriching && (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Anreicherung läuft...</h3>
            <p>Fortschritt: {Math.floor(enrichmentProgress)}%</p>
            <p>
              Geschätzte verbleibende Zeit: {Math.ceil(estimatedTimeLeft)} Sekunden
            </p>
          </div>
        </div>
      )}

      {/* Approval modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-lg max-w-3xl w-full max-h-full overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              Enrichment Ergebnisse überprüfen
            </h3>
            <div className="space-y-4">
              {approvalData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.key}</p>
                    <p className="text-gray-800 dark:text-gray-300">{String(item.value)}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleApprove(index)}
                      className={`mr-2 px-3 py-1 rounded ${
                        item.approved ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      {item.approved ? 'Genehmigt' : 'Genehmigen'}
                    </button>
                    <button
                      onClick={() => handleDeny(index)}
                      className={`px-3 py-1 rounded ${
                        !item.approved ? 'bg-red-600' : 'bg-gray-600'
                      }`}
                    >
                      {!item.approved ? 'Abgelehnt' : 'Ablehnen'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCancelApproval}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveApproval}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-100 dark:bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <p>Möchten Sie diese Firma wirklich löschen?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailsPopup;
