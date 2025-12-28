import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import authService from '../services/auth';
import { testAPI } from '../services/api';

function CounsellorDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = authService.getUser();

  useEffect(() => {
    // In a real app, you'd fetch student list from an API
    // For now, we'll show a message to use the interpretation endpoint directly
  }, []);

  const loadInterpretation = async (attemptId) => {
    try {
      setLoading(true);
      setError('');
      setSelectedAttempt(attemptId);
      const data = await testAPI.getInterpretation(attemptId);
      setInterpretation(data);
    } catch (err) {
      setError(err.message || 'Failed to load interpretation');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Counsellor Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome, {user?.full_name || 'Counsellor'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-4">View Student Interpretation</h2>
            <p className="text-slate-600 mb-4 text-sm">
              Enter a test attempt ID to view the student's interpretation and results.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Test Attempt ID
                </label>
                <input
                  type="number"
                  placeholder="Enter attempt ID"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const attemptId = parseInt(e.target.value);
                      if (attemptId) {
                        loadInterpretation(attemptId);
                      }
                    }
                  }}
                />
              </div>

              <button
                onClick={() => {
                  const attemptId = parseInt(document.querySelector('input[type="number"]').value);
                  if (attemptId) {
                    loadInterpretation(attemptId);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Load Interpretation
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Info</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p>• View student test interpretations</p>
              <p>• Access detailed career guidance</p>
              <p>• Review strengths and areas for growth</p>
              <p>• See personalized action plans</p>
            </div>
          </motion.div>
        </div>

        {loading && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading interpretation...</p>
          </div>
        )}

        {interpretation && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Interpretation Summary</h2>
              <p className="text-slate-700 leading-relaxed">{interpretation.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {interpretation.strengths.map((strength, idx) => (
                    <li key={idx} className="text-slate-700 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-amber-700 mb-4">Areas for Growth</h3>
                <ul className="space-y-2">
                  {interpretation.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-slate-700 flex items-start">
                      <span className="text-amber-500 mr-2">→</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Career Clusters</h3>
              <div className="flex flex-wrap gap-3">
                {interpretation.career_clusters.map((cluster, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {cluster}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Action Plan</h3>
              <div className="space-y-4">
                {interpretation.action_plan.map((step, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl shadow-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Readiness Status</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{interpretation.readiness_status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Risk Level</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{interpretation.risk_level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CounsellorDashboard;
