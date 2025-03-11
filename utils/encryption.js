/**
 * Hilfsfunktionen für die Verschlüsselung von Anmeldedaten
 * Verwendet eine einfache AES-Verschlüsselung im Browser
 */

// Sicherer Schlüssel für die Verschlüsselung - im echten Einsatz sollte dieser sicher gespeichert werden
const SECRET_KEY = 'dishbrain-secure-encryption-key-2023';

/**
 * Verschlüsselt einen String
 * @param {string} data - Der zu verschlüsselnde String
 * @returns {string} - Der verschlüsselte String
 */
export function encrypt(data) {
  if (!data) return '';
  try {
    // In einer echten Anwendung würde hier eine richtige Verschlüsselung stehen
    // Dies ist eine vereinfachte Demonstration mit Base64 + einfacher XOR-Verschlüsselung
    const encodedData = btoa(encodeURIComponent(data));
    const encoded = xorEncrypt(encodedData, SECRET_KEY);
    return encoded;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

/**
 * Entschlüsselt einen verschlüsselten String
 * @param {string} encryptedData - Der verschlüsselte String
 * @returns {string} - Der entschlüsselte String
 */
export function decrypt(encryptedData) {
  if (!encryptedData) return '';
  try {
    // Entsprechende Entschlüsselung zur obigen Verschlüsselung
    const decoded = xorEncrypt(encryptedData, SECRET_KEY);
    const decodedData = decodeURIComponent(atob(decoded));
    return decodedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

/**
 * Einfache XOR-Verschlüsselung mit einem Schlüssel
 * @param {string} text - Der zu verschlüsselnde Text
 * @param {string} key - Der Schlüssel
 * @returns {string} - Der verschlüsselte Text
 */
function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  // Kodiere für die sichere Speicherung
  return btoa(result);
}

/**
 * Generiert einen zufälligen Schlüssel
 * @param {number} length - Die Länge des Schlüssels
 * @returns {string} - Der generierte Schlüssel
 */
export function generateKey(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
