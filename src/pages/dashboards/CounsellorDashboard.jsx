import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { testAPI, counsellorAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

function CounsellorDashboard() {
  const { user } = useAuth();
  const [attemptId, setAttemptId] = useState('');
  const [interpretation, setInterpretation] = useState(null);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');

  const loadInterpretation = async () => {
    if (!attemptId) {
      setError('Please enter a test attempt ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await testAPI.getInterpretation(parseInt(attemptId));
      setInterpretation(data);
      
      // Load existing note if any
      await loadNote();
    } catch (err) {
      setError(err.message || 'Failed to load interpretation');
      setInterpretation(null);
    } finally {
      setLoading(false);
    }
  };

  const loadNote = async () => {
    if (!attemptId) return;
    
    try {
      const noteData = await counsellorAPI.getNote(parseInt(attemptId));
      if (noteData) {
        setSavedNote(noteData);
        setNote(noteData.notes);
      } else {
        setSavedNote(null);
        setNote('');
      }
    } catch (err) {
      // Note might not exist, that's okay
      setSavedNote(null);
      setNote('');
    }
  };

  const saveNote = async () => {
    if (!attemptId) {
      setError('Please load an interpretation first');
      return;
    }

    try {
      setSavingNote(true);
      setError('');
      const noteData = await counsellorAPI.saveNote(parseInt(attemptId), note);
      setSavedNote(noteData);
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Counsellor Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome, {user?.full_name || 'Counsellor'}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  value={attemptId}
                  onChange={(e) => setAttemptId(e.target.value)}
                  placeholder="Enter attempt ID"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      loadInterpretation();
                    }
                  }}
                />
              </div>

              <button
                onClick={loadInterpretation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load Interpretation'}
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
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Info</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>View student test interpretations</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Access detailed career guidance</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Review strengths and areas for growth</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>See personalized action plans</span>
              </div>
            </div>
          </motion.div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <Loading message="Loading interpretation..." />
          </div>
        )}

        {interpretation && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Interpretation Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-slate-900">AI Interpretation Summary</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">{interpretation.summary}</p>
            </div>

            {/* Counsellor Notes Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-slate-900">Counsellor Notes</h2>
              </div>
              
              {savedNote && (
                <div className="mb-4 p-4 bg-white/60 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        By {savedNote.counsellor_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(savedNote.created_at).toLocaleString()}
                        {savedNote.updated_at && savedNote.updated_at !== savedNote.created_at && (
                          <span> • Updated {new Date(savedNote.updated_at).toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your professional notes and insights about this student's assessment results..."
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white min-h-[200px] resize-y"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveNote}
                  disabled={savingNote || !note.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNote ? 'Saving...' : savedNote ? 'Update Notes' : 'Save Notes'}
                </button>
              </div>
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

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-2">Readiness Status</p>
                  <p className="text-2xl font-bold">{interpretation.readiness_status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-2">Risk Level</p>
                  <p className="text-2xl font-bold">{interpretation.risk_level}</p>
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

