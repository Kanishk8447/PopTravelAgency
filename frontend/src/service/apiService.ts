import axiosInstance from '../config/axiosConfig';
import axios from 'axios';

// Generic type for the API response
interface ApiResponse<T> {
  data: T;
  status: number;
  // other relevant properties from the AxiosResponse type
  // e.g., headers, config, etc.
}

const apiService = {
  postData: async <T, U>(endpoint: string, data: T) => {
    try {
      const response = await axiosInstance.post<ApiResponse<U>>(`/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  },

  postFileData: async <T, U>(endpoint: string, data: T): Promise<U> => {
    try {
      const response = await axiosInstance.post<ApiResponse<U>>(`/${endpoint}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  },

  putData: async <T, U>(endpoint: string, data: T): Promise<U> => {
    try {
      const response = await axiosInstance.put<ApiResponse<U>>(`/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  },

  getData: async <U>(endpoint: string) => {
    try {
      const response = await axiosInstance.get<ApiResponse<U>>(`/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  },

  deleteData: async <U>(endpoint: string): Promise<U> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<U>>(`/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  },

  // patch
  patchData: async <T, U>(endpoint: string, data: T): Promise<U> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<U>>(`/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('API Error (Axios):', error.message, error.response?.data);
        throw error;
      } else if (error instanceof Error) {
        console.error('API Error (Generic):', error.message);
        throw error;
      } else {
        console.error('API Error (Unknown):', error);
        throw new Error('An unknown error occurred.');
      }
    }
  }
};

export default apiService;
