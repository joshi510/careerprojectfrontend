import React from 'react';
import { motion } from 'framer-motion';

function CareerMatches({ careerClusters, overallPercentage, readinessStatus }) {
  const getAlignmentText = (index, percentage, readiness) => {
    if (readiness === 'NOT READY' || percentage < 40) {
      return "Early exploration stage. Further assessment and skill building needed before determining alignment.";
    } else if (readiness === 'PARTIALLY READY' || percentage < 60) {
      return "Moderate alignment observed. Further exploration recommended before specialization.";
    } else {
      if (index === 0) {
        return "Good alignment with your assessment profile. Continue exploring to confirm fit.";
      } else if (index === 1) {
        return "Moderate alignment observed. Further exploration recommended before specialization.";
      } else {
        return "Potential alignment. Requires further testing and exploration to confirm suitability.";
      }
    }
  };

  const topCareers = careerClusters.slice(0, 3);

  if (!topCareers || topCareers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Career Direction Areas</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {topCareers.map((career, idx) => {
          const alignmentText = getAlignmentText(idx, overallPercentage || 0, readinessStatus || 'NOT READY');
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-blue-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {idx + 1}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{career}</h3>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {alignmentText}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default CareerMatches;

