import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ResultHeader({ user, interpretation, onDownloadPDF, downloading }) {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (!interpretation || typeof interpretation.overall_percentage !== 'number') {
      console.error('Invalid interpretation data: missing overall_percentage');
      return;
    }
    
    // IMPORTANT: Use overall_percentage directly from API response (backend scores table)
    // Do NOT recalculate - only round for display animation
    const targetScore = Math.round(interpretation.overall_percentage);
    
    if (targetScore < 0 || targetScore > 100) {
      console.error(`Invalid score value: ${targetScore}. Must be between 0-100.`);
      return;
    }
    
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [interpretation?.overall_percentage]);

  const getBadgeColor = (status) => {
    if (status === 'READY' || status === 'LOW') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    if (status === 'PARTIALLY READY' || status === 'MEDIUM') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 mb-6 card-hover transition-colors duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Test Status: Completed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {user?.full_name || 'Student'}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getBadgeColor(interpretation.readiness_status)}`}>
              {interpretation.readiness_status}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getBadgeColor(interpretation.risk_level)}`}>
              Risk: {interpretation.risk_level}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-center sm:text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Score</p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
            >
              {score}%
            </motion.div>
          </div>
          
          <motion.button
            onClick={onDownloadPDF}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-hover"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Report
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ResultHeader;

