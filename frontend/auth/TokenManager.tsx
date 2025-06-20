import { useAuth } from 'react-oidc-context';

const TokenManager = () => {
  const auth = useAuth();

  // Access token: auth.user?.access_token
  // Refresh token or logout: auth.signoutRedirect()

  return null; // Or your token management UI
};

export default TokenManager;
