import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';

const IdleLogoutManager = () => {
  const auth = useAuth();
  const timeoutRef = useRef(null);
  const lastResetTimeRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const timeoutId = setTimeout(
      () => {
        if (auth.isAuthenticated) {
          auth.signoutRedirect();
          localStorage.removeItem('userConfig');
        }
      },
      15 * 60 * 1000
    );

    timeoutRef.current = timeoutId;
    lastResetTimeRef.current = new Date();
  }, [auth]);

  const handleUserActivity = useCallback(() => {
    if (!auth.isAuthenticated) return;

    resetTimer();
  }, [auth.isAuthenticated, resetTimer]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return;
    }

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [auth.isAuthenticated, handleUserActivity, resetTimer]);

  return null;
};

export default IdleLogoutManager;
