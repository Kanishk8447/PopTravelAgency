import { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      // Post both the authorization code and state back to the main application window
      window.opener.postMessage(
        {
          code: code,
          state: state
        },
        window.opener.location.origin
      );
      window.close();
    } else {
      console.error('Authorization code not found');
    }
  }, []);

  return (
    <div>
      <h2>Redirecting...</h2>
      {/* Optional: You can add a spinner or some other UI */}
    </div>
  );
};

export default OAuthCallback;
