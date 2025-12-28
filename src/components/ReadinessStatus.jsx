import React from 'react';
import { motion } from 'framer-motion';

function ReadinessStatus({ readinessStatus, readinessExplanation, riskLevel, riskExplanation }) {
  const getStatusColor = (status) => {
    if (status === 'READY') return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (status === 'PARTIALLY READY') return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getRiskColor = (risk) => {
    if (risk === 'LOW') return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (risk === 'MEDIUM') return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300"
    >
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Your Assessment Status</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Readiness Status */}
        <div className={`rounded-xl p-5 border-2 ${getStatusColor(readinessStatus)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Career Readiness</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/50 dark:bg-slate-800/50">
              {readinessStatus}
            </span>
          </div>
          {readinessExplanation && (
            <div className="mt-3">
              <p className="text-sm leading-relaxed mb-2">
                {readinessExplanation}
              </p>
              {readinessStatus === 'PARTIALLY READY' && (
                <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  ⚠️ Making a career decision now without further exploration may lead to course dissatisfaction or switching later.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Risk Level */}
        <div className={`rounded-xl p-5 border-2 ${getRiskColor(riskLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Risk Level</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/50 dark:bg-slate-800/50">
              {riskLevel}
            </span>
          </div>
          {riskExplanation && (
            <div className="mt-3">
              <p className="text-sm leading-relaxed mb-2">
                {riskExplanation}
              </p>
              {riskLevel === 'MEDIUM' && (
                <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  ⚠️ With guidance and preparation, career decisions can become more reliable. Rushing may limit future options.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ReadinessStatus;

