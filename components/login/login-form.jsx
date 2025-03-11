"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { toast } from 'react-hot-toast';
import { encrypt } from '../../utils/encryption';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo-Anmeldung mit Verzögerung, um die Verschlüsselung zu simulieren
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simuliere API-Aufruf zum Backend
      if (email.trim() && password.trim()) {
        // In einer echten Anwendung würden hier Anmeldedaten zum Server gesendet
        // Das Passwort sollte dabei sicher übertragen werden und niemals im Browser gespeichert werden
        
        // Mock-Benutzer für die Demo erstellen
        const user = {
          id: '1',
          name: 'Demo Benutzer',
          email: email.trim(),
          role: 'Admin',
          // WICHTIG: In einer echten Anwendung NIEMALS das Passwort speichern
          // Es wird hier nur zur Demonstration verschlüsselt
          accessToken: encrypt(Date.now().toString()),
        };
        
        login(user, rememberMe);
        
        toast.success('Erfolgreich angemeldet!');
        router.push('/');
      } else {
        toast.error('Bitte geben Sie E-Mail und Passwort ein.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-100">
          Willkommen zurück
        </h2>
        <p className="mt-2 text-center text-gray-400">
          Melden Sie sich an, um auf die Dishbrain-Datenbank zuzugreifen
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-100 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="name@beispiel.de"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-100 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-400">
                Angemeldet bleiben
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Passwort vergessen?
              </a>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird angemeldet...
            </div>
          ) : (
            'Anmelden'
          )}
        </button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Oder melden Sie sich an mit:
        </p>
        <div className="flex justify-center mt-4 space-x-4">
          <button className="flex items-center justify-center w-12 h-12 text-gray-300 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-colors">
            <i className="fab fa-google"></i>
          </button>
          <button className="flex items-center justify-center w-12 h-12 text-gray-300 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-colors">
            <i className="fab fa-github"></i>
          </button>
          <button className="flex items-center justify-center w-12 h-12 text-gray-300 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-colors">
            <i className="fab fa-linkedin"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
