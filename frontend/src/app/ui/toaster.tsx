import React from 'react';
import clsx from 'clsx';
import ToastNotification from '@/app/types/toast-notification';

const Toast: React.FC<ToastNotification> = ({ message, type }) => {
  return (
    <div
      className={clsx(
        "px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 animate-fadeIn flex items-center",
        {
          "bg-red-500 text-white": type === "error",
          "bg-green-500 text-white": type === "success",
          "bg-blue-500 text-white": type === "info",
          "bg-yellow-500 text-white": type === "warning"
        }
      )}
    >
      {type === "error" && <i className="bi bi-exclamation-circle mr-2"></i>}
      {type === "success" && <i className="bi bi-check-circle mr-2"></i>}
      {type === "info" && <i className="bi bi-info-circle mr-2"></i>}
      {type === "warning" && <i className="bi bi-exclamation-triangle mr-2"></i>}
      {message}
    </div>
  )
};

export default Toast;
