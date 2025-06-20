import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const STORAGE_PROVIDER = (
    import.meta.env.VITE_REACT_APP_STORAGE_PROVIDER || 'azure'
  ).toLowerCase();

  useEffect(() => {
    const logout = async () => {
      try {
        console.log('Logging out...');
        // Clean up local storage items
        localStorage.removeItem('accessToken');
        localStorage.removeItem('selectedUser');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userConfig');
          localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');

        if (STORAGE_PROVIDER === 'aws') {
          // Remove AWS Cognito specific storage
          const oidcStorageKey = `oidc.user:${import.meta.env.VITE_REACT_APP_COGNITO_AUTH_URL}:${import.meta.env.VITE_REACT_APP_COGNITO_CLIENT_ID}`;
          localStorage.removeItem(oidcStorageKey);
        }

        // Broadcast logout to other tabs
        const channel = new BroadcastChannel('auth');
        channel.postMessage('logged_out');
        channel.close();

        if (auth.isAuthenticated) {
          // Remove user data from OIDC context
          await auth.removeUser();

          // Perform sign out
          await auth.signoutRedirect({
            post_logout_redirect_uri: window.location.origin
          });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Logout failed:', error);
        setError('Failed to logout. Please try again.');
        // Fallback navigation if logout fails
        setTimeout(() => navigate('/'), 2000);
      }
    };

    logout();

    return () => {};
  }, [auth, navigate]);

  if (error) {
    return <div className="logout-error">{error}</div>;
  }

  return <div>Logging out...</div>;
}
