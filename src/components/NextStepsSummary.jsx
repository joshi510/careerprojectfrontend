import React from 'react';
import { motion } from 'framer-motion';

function NextStepsSummary({ readinessStatus, roadmap }) {
  const getSummary = () => {
    if (readinessStatus === 'NOT READY') {
      return {
        title: "What to Do Next",
        immediate: [
          "Do NOT finalize any career decision",
          "Focus on self-discovery and exploration",
          "Attend career awareness sessions",
          "Work with a career counsellor"
        ],
        timeline: "Over the next 12-18 months, continue exploring and building skills before making career decisions."
      };
    } else if (readinessStatus === 'PARTIALLY READY') {
      return {
        title: "What to Do Next",
        immediate: [
          "Do NOT rush into finalizing a career choice",
          "Continue building skills in strong areas",
          "Test interests through courses or projects",
          "Work with a career counsellor to narrow options"
        ],
        timeline: "Over the next 6-12 months, gradually narrow down interests and prepare for career decisions."
      };
    } else {
      return {
        title: "What to Do Next",
        immediate: [
          "Begin exploring specific career paths",
          "Take relevant courses to build specialized skills",
          "Test interests through projects or internships",
          "Work with a career counsellor to refine options"
        ],
        timeline: "Over the next 3-6 months, you can begin making career decisions and taking concrete steps."
      };
    }
  };

  const summary = getSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800 mb-8 transition-colors duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.title}</h2>
      </div>
      
      <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-5 border border-green-200 dark:border-green-800">
        <div className="space-y-3 mb-4">
          {summary.immediate.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-start"
            >
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            Timeline: {summary.timeline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default NextStepsSummary;

