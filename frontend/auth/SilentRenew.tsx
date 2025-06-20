// auth/SilentRenew.tsx
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const SilentRenew = () => {
  const auth = useAuth();

  useEffect(() => {
    // Access the underlying UserManager instance
    // const userManager = auth.userManager;
    // userManager.signinSilentCallback().catch((error) => {
    //   console.error('Silent renew error:', error);
    // });
  }, [auth]);

  return null;
};

export default SilentRenew;
