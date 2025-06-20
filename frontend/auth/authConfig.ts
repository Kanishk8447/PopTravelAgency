import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

const getOidcConfig = (): UserManagerSettings => {
  const cloudProvider = import.meta.env.VITE_REACT_APP_CLOUD_PROVIDER || 'azure';

  // Azure AD Configuration
  if (cloudProvider.toLowerCase() === 'azure') {
    return {
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_REACT_APP_AZURE_TENANT_ID}/v2.0`,
      client_id: import.meta.env.VITE_REACT_APP_AZURE_CLIENT_ID,
      redirect_uri: window.location.origin + '/redirect',
      post_logout_redirect_uri: window.location.origin,
      scope: `openid profile email ${import.meta.env.VITE_REACT_APP_API_SCOPE}`,
      response_type: 'code',
      automaticSilentRenew: true,
      silent_redirect_uri: window.location.origin + '/silent-renew',
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      monitorSession: true,
      accessTokenExpiringNotificationTimeInSeconds: 600,
      loadUserInfo: false
    };
  }

  // AWS Cognito Configuration
  // if (cloudProvider.toLowerCase() === 'aws') {
  //   return {
  //     authority: `https://cognito-idp.${import.meta.env.VITE_REACT_APP_AWS_REGION}.amazonaws.com/${import.meta.env.VITE_REACT_APP_AWS_COGNITO_USER_POOL_ID}`,
  //     client_id: import.meta.env.VITE_REACT_APP_AWS_COGNITO_CLIENT_ID,
  //     redirect_uri: import.meta.env.VITE_REACT_APP_AWS_COGNITO_REDIRECT_URI,
  //     response_type: 'code',
  //     scope: 'email openid profile',
  //     loadUserInfo: true,
  //     userStore: new WebStorageStateStore({ store: window.localStorage }),
  //     monitorSession: true,
  //     popup_redirect_uri: import.meta.env.VITE_REACT_APP_AWS_COGNITO_REDIRECT_URI,
  //     popup_post_logout_redirect_uri: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  //     popupWindowFeatures: {
  //       width: 480,
  //       height: 600,
  //       left: window.screenX + (window.outerWidth - 480) / 2,
  //       top: window.screenY + (window.outerHeight - 600) / 2
  //     }
  //   };
  // }

  // Throw an error if the cloud provider is not recognized
  throw new Error(
    `Unsupported cloud provider: ${cloudProvider}. Supported values are 'azure' or 'aws'.`
  );
};

export const oidcConfig: UserManagerSettings = getOidcConfig();

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scope: `openid profile email ${import.meta.env.VITE_REACT_APP_API_SCOPE}`
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
  scopes: ['openid', 'profile'],
  loginHint: 'example@domain.net'
};
