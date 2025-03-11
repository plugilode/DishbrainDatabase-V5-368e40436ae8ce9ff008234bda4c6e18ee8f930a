"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { encrypt, decrypt } from "../utils/encryption";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Überprüfe beim Start, ob ein Benutzer bereits angemeldet ist
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      // Überprüfe Local Storage für gespeicherte Anmeldedaten
      const encryptedUser = localStorage.getItem('user');
      const sessionEncryptedUser = sessionStorage.getItem('user');
      const persistentLogin = localStorage.getItem('isLoggedIn');
      const sessionLogin = sessionStorage.getItem('isLoggedIn');

      const isLoggedIn = persistentLogin === 'true' || sessionLogin === 'true';
      setIsLoggedIn(isLoggedIn);

      // Versuche, die verschlüsselten Benutzerdaten zu entschlüsseln
      let userData = null;
      
      if (encryptedUser) {
        try {
          userData = JSON.parse(decrypt(encryptedUser));
        } catch (e) {
          console.error('Fehler beim Entschlüsseln der Benutzerdaten:', e);
        }
      }
      
      if (!userData && sessionEncryptedUser) {
        try {
          userData = JSON.parse(decrypt(sessionEncryptedUser));
        } catch (e) {
          console.error('Fehler beim Entschlüsseln der Session-Benutzerdaten:', e);
        }
      }

      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen des Anmeldestatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, rememberMe = false) => {
    // Verschlüssele die Benutzerdaten
    const encryptedUser = encrypt(JSON.stringify(userData));
    
    if (rememberMe) {
      localStorage.setItem('user', encryptedUser);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.setItem('user', encryptedUser);
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
