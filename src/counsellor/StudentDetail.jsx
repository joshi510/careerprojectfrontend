import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [isReportLocked, setIsReportLocked] = useState(false);

  // Sample student data - replace with API call
  const studentData = {
    id: parseInt(studentId),
    name: 'John Doe',
    email: 'john.doe@example.com',
    testAttempts: [
      {
        id: 1,
        completedAt: '2024-01-15T10:30:00',
        scores: [
          { dimension: 'Analytical Thinking', score_value: 4.2, percentile: 85 },
          { dimension: 'Logical Reasoning', score_value: 3.8, percentile: 72 },
          { dimension: 'Problem Solving', score_value: 4.5, percentile: 90 },
          { dimension: 'Creativity', score_value: 3.5, percentile: 65 },
          { dimension: 'Communication', score_value: 4.0, percentile: 78 },
          { dimension: 'Leadership', score_value: 3.2, percentile: 58 }
        ],
        interpretation: {
          interpretation_text: 'Strong analytical and problem-solving capabilities with excellent logical reasoning. Shows good communication skills with room for growth in leadership and creative thinking.',
          strengths: '• Excellent analytical thinking\n• Strong problem-solving abilities\n• Good communication skills',
          areas_for_improvement: '• Leadership development\n• Creative thinking enhancement\n• Team collaboration'
        },
        careers: [
          { career_name: 'Software Engineer', match_score: 88, category: 'Technology' },
          { career_name: 'Data Scientist', match_score: 85, category: 'Technology' },
          { career_name: 'Product Manager', match_score: 75, category: 'Business' }
        ],
        notes: 'Student shows strong technical aptitude. Recommend exploring software development paths.',
        isLocked: false
      }
    ]
  };

  const currentAttempt = studentData.testAttempts[0];

  const handleSaveNotes = () => {
    // TODO: Save notes to API
    console.log('Saving notes:', notes);
  };

  const handleLockReport = () => {
    setIsReportLocked(true);
    // TODO: Lock report via API
    console.log('Locking report for student:', studentId);
  };

  const handleUnlockReport = () => {
    setIsReportLocked(false);
    // TODO: Unlock report via API
    console.log('Unlocking report for student:', studentId);
  };

  const getScoreColor = (score) => {
    if (score >= 4.0) return 'bg-green-500';
    if (score >= 3.0) return 'bg-blue-500';
    if (score >= 2.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/counsellor')}
                className="text-slate-600 hover:text-slate-900 mb-2 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-slate-900">{studentData.name}</h1>
              <p className="text-slate-600">{studentData.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isReportLocked ? handleUnlockReport : handleLockReport}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isReportLocked
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isReportLocked ? 'Unlock Report' : 'Lock Report'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Raw Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/60"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Raw Scores</h2>
              <div className="space-y-4">
                {currentAttempt.scores.map((score, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{score.dimension}</span>
                        <span className="text-sm font-semibold text-slate-700">
                          {score.score_value.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score.score_value / 5) * 100}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className={`h-2 rounded-full ${getScoreColor(score.score_value)}`}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-500">Percentile</span>
                        <span className="text-xs font-medium text-slate-700">{score.percentile}th</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-purple-200/60"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">AI Insights</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Overview</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {currentAttempt.interpretation.interpretation_text}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Strengths</h4>
                    <div className="space-y-1 text-slate-700 text-sm">
                      {currentAttempt.interpretation.strengths.split('\n').map((item, idx) => (
                        <p key={idx}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Areas for Improvement</h4>
                    <div className="space-y-1 text-slate-700 text-sm">
                      {currentAttempt.interpretation.areas_for_improvement.split('\n').map((item, idx) => (
                        <p key={idx}>{item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Career Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/60"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Career Recommendations</h2>
              <div className="space-y-4">
                {currentAttempt.careers.map((career, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">{career.career_name}</h3>
                      <p className="text-sm text-slate-600">{career.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{career.match_score}%</p>
                      <p className="text-xs text-slate-500">Match Score</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200/60"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Counsellor Notes</h3>
              <textarea
                value={notes || currentAttempt.notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this student..."
                className="w-full h-48 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900"
                disabled={isReportLocked}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNotes}
                disabled={isReportLocked}
                className={`mt-4 w-full py-3 rounded-lg font-medium transition-all ${
                  isReportLocked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                }`}
              >
                Save Notes
              </motion.button>
            </motion.div>

            {/* Test Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200/60"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Test Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed At</p>
                  <p className="font-medium text-slate-900">
                    {new Date(currentAttempt.completedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isReportLocked
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isReportLocked ? 'Locked' : 'Active'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;

