import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const useTabSync = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const channel = new BroadcastChannel('auth');

    const handleAuthChange = (message: any) => {
      if (message.data === 'logged_in' && !auth.isAuthenticated) {
        // Reload to pick up the new auth state from localStorage
        window.location.reload();
      } else if (message.data === 'logged_out' && auth.isAuthenticated) {
        // Clear OIDC user state and redirect
        auth.removeUser();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('selectedUser');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userConfig');
        navigate('/');
      }
    };

    channel.addEventListener('message', handleAuthChange);

    return () => {
      channel.removeEventListener('message', handleAuthChange);
      channel.close();
    };
  }, [auth, navigate]);
};

export default useTabSync;
