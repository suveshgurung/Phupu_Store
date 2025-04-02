interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export default ToastNotification;
