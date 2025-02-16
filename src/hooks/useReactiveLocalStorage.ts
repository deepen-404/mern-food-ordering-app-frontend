import { useState, useEffect } from 'react';

export function useReactiveLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (!key) return initialValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    useEffect(() => {
        function handleLocalStorageChange() {
            if (!key) return;

            const newValue = localStorage.getItem(key);
            if (newValue !== null) setStoredValue(JSON.parse(newValue));
        }
        window.addEventListener('storage', handleLocalStorageChange);
        return () => window.removeEventListener('storage', handleLocalStorageChange);
    }, []);

    useEffect(() => {
        if (!key) return;

        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}
