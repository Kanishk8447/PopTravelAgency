import { useEffect } from 'react';

const OAuthRedirect = () => {
  useEffect(() => {
    // Parse the authorization code from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Post the authorization code back to the main application window
      window.opener.postMessage({ code: code }, window.opener.location.origin);
      // Close the popup window after sending the message
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

export default OAuthRedirect;
