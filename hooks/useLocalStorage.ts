
import { useState, useEffect, useCallback } from 'react';

// This is the key for our custom event.
const CUSTOM_STORAGE_EVENT_TYPE = 'custom-local-storage-change';

// Dispatch a custom event that will be caught by other hooks on the same page.
const dispatchStorageEvent = (key: string, newValue: any) => {
  window.dispatchEvent(new CustomEvent(CUSTOM_STORAGE_EVENT_TYPE, {
    detail: { key, newValue: JSON.stringify(newValue) }
  }));
};

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // The `readValue` function remains mostly the same.
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // The `setValue` function is updated to dispatch our custom event.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
      // Dispatch the custom event to notify other hooks on the same page.
      dispatchStorageEvent(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // The `useEffect` hook is updated to listen for both standard and custom events.
  useEffect(() => {
    // This handler will react to changes from other tabs/windows.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };
    
    // This handler will react to changes from the same tab (our custom event).
    const handleCustomStorageChange = (event: CustomEvent) => {
      if (event.detail.key === key && event.detail.newValue) {
        setStoredValue(JSON.parse(event.detail.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CUSTOM_STORAGE_EVENT_TYPE, handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CUSTOM_STORAGE_EVENT_TYPE, handleCustomStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
