// Layout.tsx
// import { useAuth } from 'react-oidc-context';
import LoadingComponent from '../common/Loading';
import Login from '../../auth/Login';
import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';
import { useApi } from '../context/ApiContext';


// const STORAGE_PROVIDER = (import.meta.env.VITE_REACT_APP_STORAGE_PROVIDER || 'azure').toLowerCase();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useApi();
//   const auth = useAuth();
//   useTabSync();

  const renderContent = () => {
    // if (isLoading) {
    //   return <LoadingComponent />;
    // }
    return auth.isAuthenticated ? <AuthenticatedUserLayout children={children} /> : <Login />;
  };

  return (
    <>
      <div>{renderContent()}</div>
      {loading && <LoadingComponent />}
      <Toaster
        position="top-center"
        richColors={true}
        visibleToasts={3}
        duration={3000}
        toastOptions={{
          style: {
            fontSize: '16px'
          }
        }}
      />
    </>
  );
};

export default Layout;
