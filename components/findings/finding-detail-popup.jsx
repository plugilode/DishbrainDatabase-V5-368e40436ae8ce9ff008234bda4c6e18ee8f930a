"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const FindingDetailPopup = ({ finding, onClose, onApprove, onReject }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState('');

  const handleAction = async (action) => {
    setIsLoading(true);
    
    try {
      // Simuliere eine kurze Latenz
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      if (action === 'approve') {
        await onApprove(finding.id, comments);
        toast.success('Finding genehmigt und gespeichert');
      } else {
        await onReject(finding.id, comments);
        toast.info('Finding wurde verworfen');
      }
      onClose();
    } catch (error) {
      console.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} finding:`, error);
      toast.error(`Fehler beim ${action === 'approve' ? 'Genehmigen' : 'Ablehnen'} des Findings: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion hinzugefügt, um den Fehler abzufangen, wenn das Close-Event vor dem Ende des Approve/Reject ausgelöst wird
  const handleSafeClose = () => {
    if (!isLoading) {
      onClose();
    } else {
      toast.info('Bitte warten Sie, bis die aktuelle Operation abgeschlossen ist.');
    }
  };

  // Konvertiere das Datum in ein lesbares Format
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString || 'Kein Datum';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-2xl w-full border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Finding Details</h3>
          <button 
            onClick={handleSafeClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Type & Relevance Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-sm ${
              finding.type === 'Publication' ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50' :
              finding.type === 'Patent' ? 'bg-green-900/50 text-green-400 border border-green-800/50' :
              finding.type === 'Collaboration' ? 'bg-purple-900/50 text-purple-400 border border-purple-800/50' :
              finding.type === 'Award' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800/50' :
              finding.type === 'Conference' ? 'bg-pink-900/50 text-pink-400 border border-pink-800/50' :
              'bg-gray-900/50 text-gray-400 border border-gray-800/50'
            }`}>
              <i className={`mr-1 fas ${
                finding.type === 'Publication' ? 'fa-file-alt' :
                finding.type === 'Patent' ? 'fa-certificate' :
                finding.type === 'Collaboration' ? 'fa-handshake' :
                finding.type === 'Award' ? 'fa-trophy' :
                finding.type === 'Conference' ? 'fa-users' :
                'fa-flask'
              }`}></i>
              {finding.type}
            </span>
            
            <span className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Relevanz:</span>
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    finding.relevance > 0.9 ? 'bg-green-500' :
                    finding.relevance > 0.8 ? 'bg-blue-500' :
                    finding.relevance > 0.7 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${finding.relevance * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-300 font-medium">{Math.round(finding.relevance * 100)}%</span>
            </span>
          </div>
          
          {/* Expert & Date */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <span className="text-gray-400 text-sm">Experte:</span>
              <h4 className="text-blue-400 font-medium">{finding.expert}</h4>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <i className="fas fa-calendar"></i>
              {formatDate(finding.date)}
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <h4 className="text-sm text-gray-400 mb-2">Inhalt:</h4>
            <p className="text-gray-100">{finding.content}</p>
          </div>
          
          {/* Source with verification */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Quelle:</h4>
            <div className="bg-gray-800/30 p-3 rounded-lg flex justify-between items-center">
              <a 
                href={finding.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-external-link-alt"></i>
                <span className="truncate">{finding.source}</span>
              </a>
              
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-400"></i>
                <span className="text-sm text-gray-300">Verifiziert</span>
              </div>
            </div>
          </div>
          
          {/* Related Information */}
          {finding.relatedData && (
            <div className="space-y-2">
              <h4 className="text-sm text-gray-400 flex items-center gap-2">
                <i className="fas fa-link"></i>
                Verwandte Daten:
              </h4>
              <div className="bg-gray-800/30 p-3 rounded-lg">
                <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {typeof finding.relatedData === 'object' 
                    ? JSON.stringify(finding.relatedData, null, 2)
                    : finding.relatedData}
                </pre>
              </div>
            </div>
          )}
          
          {/* Comments for approval/rejection */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Kommentar hinzufügen:</h4>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Optionaler Kommentar zur Genehmigung oder Ablehnung..."
              className="w-full h-24 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner text-sm"
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-5 border-t border-gray-800 flex justify-between">
          <button
            onClick={() => handleAction('reject')}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Wird bearbeitet...
              </>
            ) : (
              <>
                <i className="fas fa-times"></i>
                Ablehnen
              </>
            )}
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSafeClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Später entscheiden
            </button>
            <button
              onClick={() => handleAction('approve')}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Genehmigen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindingDetailPopup;
