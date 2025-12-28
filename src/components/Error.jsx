import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Error({ message, onRetry, showBack = true }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 max-w-md w-full text-center transition-colors duration-300"
      >
        <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Error</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{message || 'Something went wrong'}</p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors btn-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          )}
          {showBack && (
            <motion.button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors btn-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Error;
