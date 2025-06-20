import axios from 'axios';
import { notification } from '../service/notification-Service';
// import logout from '../auth/Logout';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL // Replace with your API base URL
});

const cloudProvider = import.meta.env.VITE_REACT_APP_CLOUD_PROVIDER || 'azure';
// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (cloudProvider.toLowerCase() === 'aws') {
      const idToken = localStorage.getItem('idToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (idToken) {
        config.headers['X-Id-Token'] = idToken;
      }
    } else {
      // Azure handling remains the same
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API key interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['x-api-key'] = `159c603a-2d22-4a5d-8b01-8158a5f6973c`; // Very common -  'x-api-key'
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.data?.details?.toString().startsWith('403')) {
//       const strippedNotification = error.response.data.details.replace('403:', '');
//       notification('error', `${strippedNotification}`, 'top-center');
//     } else if (error.response && error.response.status === 401) {
//       if (error.response.data.detail === 'Token has expired') {
//         notification('error', 'Token has expired', 'top-center');
//         logout();
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
