import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to set state with a delay.
 * @param initialValue - The initial state value.
 * @param delay - Delay in milliseconds for updating the state.
 * @returns [state, setDelayedState] - The state and a function to set state with a delay.
 */
const useDelayedState = <T>(initialValue: T, delay: number = 1000): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setDelayedState = (value: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout
    }

    timeoutRef.current = setTimeout(() => {
      setState(value);
    }, delay);
  };

  // Cleanup timeout on unmount or delay changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setDelayedState];
};

export default useDelayedState;
