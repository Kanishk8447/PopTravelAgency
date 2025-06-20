export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${import.meta.env.VITE_REACT_APP_AWS_REGION}.amazonaws.com/${import.meta.env.VITE_REACT_APP_AWS_COGNITO_USER_POOL_ID}`,
  client_id: import.meta.env.VITE_REACT_APP_AWS_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REACT_APP_AWS_COGNITO_REDIRECT_URI,
  response_type: 'code',
  scope: 'email openid profile',
  popup_redirect_uri: import.meta.env.VITE_REACT_APP_AWS_COGNITO_REDIRECT_URI,
  popup_post_logout_redirect_uri: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  popupWindowFeatures: {
    width: 480,
    height: 600,
    left: window.screenX + (window.outerWidth - 480) / 2,
    top: window.screenY + (window.outerHeight - 600) / 2
  }
};
