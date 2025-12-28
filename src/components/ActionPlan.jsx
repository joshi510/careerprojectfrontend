import React from 'react';
import { motion } from 'framer-motion';

function ActionPlan({ actionPlan, roadmap }) {
  // Use roadmap if available, otherwise fallback to actionPlan
  let timePeriods = [];
  
  if (roadmap && roadmap.phase1 && roadmap.phase2 && roadmap.phase3) {
    timePeriods = [
      { 
        label: roadmap.phase1.duration || '0-3 Months', 
        title: roadmap.phase1.title || 'Foundation',
        description: roadmap.phase1.description || '',
        steps: roadmap.phase1.actions || [] 
      },
      { 
        label: roadmap.phase2.duration || '3-6 Months', 
        title: roadmap.phase2.title || 'Skill Build',
        description: roadmap.phase2.description || '',
        steps: roadmap.phase2.actions || [] 
      },
      { 
        label: roadmap.phase3.duration || '6-12 Months', 
        title: roadmap.phase3.title || 'Decision',
        description: roadmap.phase3.description || '',
        steps: roadmap.phase3.actions || [] 
      }
    ].filter(period => period.steps.length > 0);
  } else if (actionPlan && Array.isArray(actionPlan)) {
    // Fallback to old format
    timePeriods = [
      { label: '0-3 Months', title: 'Foundation', steps: actionPlan.slice(0, Math.ceil(actionPlan.length / 3)) },
      { label: '3-6 Months', title: 'Skill Build', steps: actionPlan.slice(Math.ceil(actionPlan.length / 3), Math.ceil(actionPlan.length * 2 / 3)) },
      { label: '6-12 Months', title: 'Decision', steps: actionPlan.slice(Math.ceil(actionPlan.length * 2 / 3)) }
    ].filter(period => period.steps.length > 0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Recommended Next Steps</h2>
      
      <div className="space-y-6">
        {timePeriods.map((period, periodIdx) => (
          <motion.div
            key={periodIdx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + periodIdx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 card-hover"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                {periodIdx + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{period.title || period.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{period.label}</p>
                {period.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">{period.description}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-3 ml-16">
              {period.steps.map((step, stepIdx) => (
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + periodIdx * 0.1 + stepIdx * 0.05 }}
                  className="flex items-start"
                >
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ActionPlan;

