import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AIInsight({ summary }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Split summary into short preview and full text
  const sentences = summary.split('. ').filter(s => s.trim());
  const shortPreview = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  const fullText = summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-slate-700 mb-8 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          AI Career Insight
        </h2>
        {sentences.length > 2 && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </motion.button>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {sentences.map((sentence, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {sentence.trim()}.
              </motion.p>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-slate-700 dark:text-slate-300 leading-relaxed"
          >
            {shortPreview}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AIInsight;

