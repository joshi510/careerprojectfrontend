import React from 'react';
import { motion } from 'framer-motion';

function WhatThisMeans({ readinessStatus, overallPercentage, careerDirection }) {
  const getMessage = () => {
    if (readinessStatus === 'NOT READY') {
      return {
        title: "What This Means for You",
        content: [
          "You're in the early stages of career exploration, which is completely normal and healthy.",
          "Your assessment shows you're still developing skills across different areas. This is actually a good thing - it means you have time to explore and find what truly interests you.",
          "Right now, your focus should be on learning about different career paths, building foundational skills, and understanding your interests better.",
          "There's no pressure to decide on a career right away. Take this time to explore, ask questions, and try different activities.",
          "Work with a career counsellor to understand your options better and create a plan for your exploration journey."
        ]
      };
    } else if (readinessStatus === 'PARTIALLY READY') {
      return {
        title: "What This Means for You",
        content: [
          "You're making good progress in your career exploration journey.",
          "Your assessment shows you have developing strengths in certain areas, which is a positive sign. However, you still need more time to build skills and explore options.",
          "This is a great time to focus on strengthening your identified areas while continuing to explore different career paths.",
          "You don't need to finalize a career choice yet, but you can start narrowing down your interests and exploring specific domains.",
          "Continue working with a career counsellor to refine your direction and build the skills needed for your future career."
        ]
      };
    } else {
      return {
        title: "What This Means for You",
        content: [
          "You're in a good position for career exploration and planning.",
          "Your assessment shows strong readiness, which means you have developed skills and can begin exploring specific career paths.",
          "You can start exploring careers in areas that interest you, particularly those aligned with your strengths.",
          "While you're ready to explore, remember that you don't need to rush into a final decision. Take time to ensure the right fit.",
          "Continue building relevant skills and work closely with a career counsellor to refine your options and make informed decisions."
        ]
      };
    }
  };

  const message = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-800 mb-8 transition-colors duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{message.title}</h2>
      </div>
      
      <div className="space-y-4">
        {message.content.map((paragraph, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="text-slate-700 dark:text-slate-300 leading-relaxed flex items-start"
          >
            <span className="text-indigo-500 mr-3 mt-1">•</span>
            <span>{paragraph}</span>
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

export default WhatThisMeans;

