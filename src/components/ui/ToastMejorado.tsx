import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

interface ToastProps {
  title: string;
  description: string;
  type: "success" | "error" | "warning";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  type,
  duration = 5000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        const newProgress = oldProgress - 100 / (duration / 100);
        return newProgress > 0 ? newProgress : 0;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      case "warning":
        return "from-yellow-400 to-yellow-600";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden`}
      >
        <div
          className={`h-2 bg-gradient-to-r ${getGradient()}`}
          style={{ width: `${progress}%` }}
        />
        <div className="p-4">
          <div className="flex items-start">
            {getIcon()}
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
            <button
              className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
