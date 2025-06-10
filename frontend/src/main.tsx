import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import { Toaster } from 'sonner';
import router from './routes/route';
import { ApiProvider } from './context/ApiContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <RouterProvider router={router} />
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
    </ApiProvider>

  </StrictMode>,
)
