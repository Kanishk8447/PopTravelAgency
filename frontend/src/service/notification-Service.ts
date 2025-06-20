// src/app/services/notificationService.ts
import { toast } from 'sonner';
import apiService from './apiService';

// export const getNotifications = async (): Promise<any> => {
//   try {
//     const response = await apiService.getData('notification');
//     console.log('sddssd')
//     return response;
//   } catch (error) {
//     console.error('Failed to fetch notifications', error);
//     throw error;
//   }
// };

export const notification = (
  type: 'success' | 'error' | 'info' | 'warning' | 'default',
  message: string,
  position:
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right' = 'top-center'
): void => {
  const config = {
    position
  };

  switch (type) {
    case 'success':
      toast.success(message, config);
      break;
    case 'error':
      toast.error(message, config);
      break;
    case 'info':
      toast.info(message, config);
      break;
    case 'warning':
      toast.warning(message, config);
      break;
    default:
      toast(message, config);
      break;
  }
};
export const promiseToast = async <T>(
  promiseFunction: () => Promise<T>,
  messages: { loading: string; success: (data: T) => string; error: (err: any) => string }
) => {
  return toast.promise(promiseFunction, {
    loading: messages.loading,
    success: (data) => messages.success(data),
    error: (err) => messages.error(err)
  });
};
