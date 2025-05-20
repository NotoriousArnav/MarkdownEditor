
import { useEffect, useCallback } from 'react';

/**
 * A simple hook for keyboard shortcuts
 * @param key The key combination (e.g., 'ctrl+s', 'shift+a')
 * @param callback The function to execute
 */
export const useHotkeys = (key: string, callback: (e: KeyboardEvent) => void) => {
  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      // Parse the key combination
      const keys = key.toLowerCase().split('+');
      const mainKey = keys[keys.length - 1];

      // Check for modifiers
      const needCtrl = keys.includes('ctrl');
      const needShift = keys.includes('shift');
      const needAlt = keys.includes('alt');

      // Match the key and modifiers
      if (
        e.key.toLowerCase() === mainKey &&
        !!e.ctrlKey === needCtrl &&
        !!e.shiftKey === needShift &&
        !!e.altKey === needAlt
      ) {
        callback(e);
      }
    },
    [key, callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [keyHandler]);
};
