import React from 'react';
import { motion } from 'framer-motion';

function Result() {
  // Sample result data - replace with API call
  const resultData = {
    interpretation_text: "Your assessment reveals a strong analytical mindset with excellent problem-solving capabilities. You show particular strength in logical reasoning and creative thinking, which positions you well for careers in technology and innovation.",
    strengths: "• Strong analytical thinking\n• Excellent problem-solving skills\n• Creative approach to challenges\n• Good communication abilities",
    areas_for_improvement: "• Leadership development opportunities\n• Team collaboration skills\n• Time management techniques",
    careers: [
      {
        career_name: "Software Engineer",
        description: "Design and develop software solutions, applications, and systems.",
        category: "Technology"
      },
      {
        career_name: "Data Scientist",
        description: "Analyze complex data to extract insights and build predictive models.",
        category: "Technology"
      },
      {
        career_name: "Product Manager",
        description: "Lead product development from conception to launch.",
        category: "Business"
      }
    ],
    action_plan: "0-6 months: Focus on building technical skills through online courses and projects\n6-12 months: Gain practical experience through internships or freelance work\n12-24 months: Pursue advanced certifications and network within your chosen field"
  };

  const parseActionPlan = (plan) => {
    const sections = plan.split(/\d+-\d+ months:/);
    const timeline = [];
    const matches = plan.matchAll(/(\d+-\d+ months):\s*([^\d]+)/g);
    for (const match of matches) {
      timeline.push({
        period: match[1],
        steps: match[2].trim().split('\n').filter(step => step.trim())
      });
    }
    return timeline;
  };

  const actionPlanTimeline = parseActionPlan(resultData.action_plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your Career Profile
          </h1>
          <p className="text-slate-600 text-lg">
            Discover your strengths and explore career opportunities
          </p>
        </motion.div>

        {/* Interpretation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 border border-slate-200/60"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Assessment Overview</h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            {resultData.interpretation_text}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border border-green-200/60"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Key Strengths
            </h3>
            <div className="space-y-2 text-slate-700">
              {resultData.strengths.split('\n').map((strength, idx) => (
                <p key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{strength.replace('•', '').trim()}</span>
                </p>
              ))}
            </div>
          </motion.div>

          {/* Growth Opportunities Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-200/60"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Growth Opportunities
            </h3>
            <div className="space-y-2 text-slate-700">
              {resultData.areas_for_improvement.split('\n').map((area, idx) => (
                <p key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{area.replace('•', '').trim()}</span>
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Career Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Career Recommendations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resultData.careers.map((career, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-200/60 hover:shadow-xl transition-all"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {career.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {career.career_name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {career.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Plan Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200/60"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">Your Action Plan</h2>
          <div className="relative">
            {actionPlanTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="relative pl-8 pb-8 last:pb-0"
              >
                {idx < actionPlanTimeline.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                )}
                <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {item.period}
                  </h3>
                  <ul className="space-y-2">
                    {item.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start text-slate-700">
                        <span className="mr-2 text-blue-600">→</span>
                        <span>{step.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            This assessment is designed to provide general career guidance and insights. Results are based on your responses and are intended for informational purposes only. We recommend consulting with a qualified career counsellor to discuss your results in detail.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Result;

