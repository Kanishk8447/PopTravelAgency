
interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_BASE_URL: string;
  readonly VITE_REACT_APP_CLOUD_PROVIDER: string;
    readonly VITE_REACT_APP_AWS_COGNITO_REDIRECT_URI: string;

  // Add other environment variables as needed
}
// Add export to make TypeScript know this is intentionally defined
export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
