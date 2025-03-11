"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const RegisterForm = ({ onSuccess, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (!fullName || !email || !password) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Die Passwörter stimmen nicht überein');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Bitte akzeptieren Sie die Nutzungsbedingungen');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In einer echten Anwendung würde hier eine API-Anfrage erfolgen
      // Für Demo-Zwecke simulieren wir eine erfolgreiche Registrierung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Neue Benutzerinformationen
      const userData = {
        fullName,
        email,
        companyName,
        registrationDate: new Date().toISOString()
      };
      
      // Speichern der Demo-Benutzerinformationen im localStorage
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      existingUsers.push({
        email,
        password,
        name: fullName,
        companyName
      });
      localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
      
      toast.success('Registrierung erfolgreich!');
      
      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-800/50 max-w-md w-full mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Neues Konto erstellen
        </h2>
        <p className="text-gray-400">Registrieren Sie sich für Zugriff auf die AI Expert Datenbank</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Vollständiger Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            placeholder="Max Mustermann"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            E-Mail Adresse *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            placeholder="name@unternehmen.de"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
            Unternehmen
          </label>
          <input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            placeholder="Firmenname GmbH"
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Passwort *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Passwort bestätigen *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-400">
              Ich stimme den <a href="#" className="text-blue-500 hover:text-blue-400">Nutzungsbedingungen</a> und der <a href="#" className="text-blue-500 hover:text-blue-400">Datenschutzrichtlinie</a> zu *
            </label>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird registriert...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Registrieren
              </>
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Abbrechen
            </button>
          )}
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>
          Bereits registriert?{' '}
          <button 
            onClick={onClose} 
            className="text-blue-500 hover:text-blue-400"
          >
            Anmelden
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
