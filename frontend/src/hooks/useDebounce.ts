import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debounce
 * Retrasa la ejecución de una función hasta que el usuario deja de hacer cambios
 * @param value - El valor a debounce
 * @param delay - El tiempo de espera en milisegundos (default: 800)
 * @returns El valor debouncido
 */
export function useDebounce<T>(value: T, delay: number = 800): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un timer para actualizar el valor debouncido
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes de que se ejecute
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
