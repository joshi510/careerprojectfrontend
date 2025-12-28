import React from 'react';
import { motion } from 'framer-motion';
import RadarChart from './RadarChart';

function SkillReadinessChart({ interpretation }) {
  // Create skill readiness data based on interpretation
  const skillData = [
    { category: 'Logical Thinking', value: interpretation.readiness_status === 'READY' ? 85 : interpretation.readiness_status === 'PARTIALLY READY' ? 65 : 45 },
    { category: 'Numerical Ability', value: interpretation.readiness_status === 'READY' ? 80 : interpretation.readiness_status === 'PARTIALLY READY' ? 60 : 40 },
    { category: 'Verbal Ability', value: interpretation.readiness_status === 'READY' ? 75 : interpretation.readiness_status === 'PARTIALLY READY' ? 55 : 35 },
    { category: 'Focus', value: interpretation.readiness_status === 'READY' ? 70 : interpretation.readiness_status === 'PARTIALLY READY' ? 50 : 30 },
    { category: 'Confidence', value: interpretation.readiness_status === 'READY' ? 90 : interpretation.readiness_status === 'PARTIALLY READY' ? 70 : 50 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
    >
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Skill Readiness Map</h3>
      <div className="h-64">
        <RadarChart data={skillData} />
      </div>
    </motion.div>
  );
}

export default SkillReadinessChart;

