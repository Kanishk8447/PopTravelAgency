import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { Toaster } from 'sonner';
import { oidcConfig } from '../auth/authConfig';
import router from './routes/route';
import { ApiProvider, useApi } from './context/ApiContext';
import { UserManager } from 'oidc-client-ts';
import LoadingComponent from './common/Loading';

const userManager = new UserManager(oidcConfig);

function App() {
  return (
    <StrictMode>
      <AuthProvider {...oidcConfig} userManager={userManager}>
        <ApiProvider>
          <AppContent />
        </ApiProvider>
      </AuthProvider>
    </StrictMode>
  );
}

function AppContent() {
  const { loading } = useApi();

  return (
    <>
      {loading && <LoadingComponent />}
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors={true}
        visibleToasts={3}
        duration={3000}
        toastOptions={{
          style: {
            fontSize: '16px',
          },
        }}
      />
    </>
  );
}

// Ensure we're only using one App component
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
