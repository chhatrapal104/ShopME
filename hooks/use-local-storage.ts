import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

/**
 * A useState hook that persists its value in localStorage.
 * Handles SSR safely (no window access on server).
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`useLocalStorage: error setting "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  // Keep in sync across tabs
  useEffect(() => {
    const handler = () => setStoredValue(readValue());
    window.addEventListener("local-storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("local-storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
