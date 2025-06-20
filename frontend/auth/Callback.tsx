import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    // if (auth.error) {
    //   console.error('Callback error:', auth.error);
    //   navigate('/welcome'); // Redirect to home or error page on failure
    //   return;
    // }
    // if (auth.isAuthenticated) {
    //   navigate('/welcome'); // Redirect to welcome page on success
    // }
  }, [auth, navigate]);

  return <div>Processing login...</div>;
};

export default Callback;
