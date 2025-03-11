import { useState, useEffect } from 'react';

/**
 * Hook für Debouncing von Werten
 * Verzögert die Aktualisierung eines Werts, um häufige Updates zu vermeiden
 * 
 * @param {any} value - Der zu debounce-ende Wert
 * @param {number} delay - Die Verzögerung in Millisekunden
 * @returns {any} - Der debounced Wert
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Setze ein Timeout, um den Wert nach der Verzögerung zu aktualisieren
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bereinige das Timeout, wenn sich der Wert oder die Komponente ändert
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}
