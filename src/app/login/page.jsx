"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../../components/login/login-form';
import RegisterPopup from '../../../components/login/register-popup';
import { useAuth } from '../../../context/auth-context';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  
  // Prüfe, ob Benutzer bereits eingeloggt ist
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router, isLoggedIn]);

  const handleRegisterSuccess = (userData) => {
    setShowRegisterPopup(false);
    toast.success(`Willkommen, ${userData.fullName}! Sie können sich jetzt anmelden.`);
  };

  // Öffne Registrierungs-Popup, wenn die URL einen query parameter "register=true" enthält
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('register') === 'true') {
        setShowRegisterPopup(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-row">
      {/* Linke Seite - Visuelle Darstellung */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 flex flex-col justify-start p-12 z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Dishbrain KI Database</h1>
            <p className="text-xl text-blue-200 max-w-md mt-4">
              Ihre zentrale Plattform für KI-Forschung, Unternehmen und Experten im Bereich künstliche Intelligenz
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-medium text-white mb-4">Was bietet Dishbrain KI Database?</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-100">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                Umfassende KI-Unternehmensdatenbank
              </li>
              <li className="flex items-center text-blue-100">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                Detaillierte Profile von KI-Experten
              </li>
              <li className="flex items-center text-blue-100">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                Neueste Forschungsergebnisse und Publikationen
              </li>
              <li className="flex items-center text-blue-100">
                <i className="fas fa-check-circle text-green-400 mr-2"></i>
                KI-Trends und Marktentwicklungen
              </li>
            </ul>
          </div>
        </div>
        
        {/* Dekorative Elemente */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-indigo-500/20 rounded-full filter blur-2xl"></div>
          
          {/* Netzwerklinien als Hintergrund */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="#fff"></circle>
              </pattern>
              <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
            </svg>
          </div>
        </div>
      </div>

      {/* Rechte Seite - Login Formular */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Dishbrain KI Database
            </h2>
            <p className="text-gray-400">Melden Sie sich mit Ihrem Konto an</p>
          </div>
          
          <LoginForm 
            onSuccess={() => router.push('/')} 
            onRegisterClick={() => setShowRegisterPopup(true)}
          />
        </div>
      </div>
      
      {/* Registrierungs-Popup */}
      {showRegisterPopup && (
        <RegisterPopup 
          onClose={() => setShowRegisterPopup(false)} 
          onSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}
