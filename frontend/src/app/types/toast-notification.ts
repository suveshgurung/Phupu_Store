interface ToastNotification {
  message: string;
  type: 'success' | 'error';
  id: number;
};

export default ToastNotification;
