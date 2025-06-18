
interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_BASE_URL: string;
  // Add other environment variables as needed
}
// Add export to make TypeScript know this is intentionally defined
export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
