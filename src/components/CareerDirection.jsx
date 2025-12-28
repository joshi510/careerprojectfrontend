import React from 'react';
import { motion } from 'framer-motion';

function CareerDirection({ careerDirection, careerDirectionReason }) {
  if (!careerDirection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-purple-200 dark:border-purple-800 mb-8 transition-colors duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Career Direction</h2>
      </div>
      
      <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">
          {careerDirection}
        </h3>
        {careerDirectionReason && (
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {careerDirectionReason}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default CareerDirection;

