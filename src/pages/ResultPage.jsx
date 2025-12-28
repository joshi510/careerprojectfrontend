import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { testAPI, counsellorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ResultHeader from '../components/ResultHeader';
import ScoreSummary from '../components/ScoreSummary';
import SkillReadinessChart from '../components/SkillReadinessChart';
import CareerMatches from '../components/CareerMatches';
import CareerDirection from '../components/CareerDirection';
import ReadinessStatus from '../components/ReadinessStatus';
import WhatThisMeans from '../components/WhatThisMeans';
import NextStepsSummary from '../components/NextStepsSummary';
import AIInsight from '../components/AIInsight';
import ActionPlan from '../components/ActionPlan';
import { generatePDF } from '../utils/pdfGenerator';

function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interpretation, setInterpretation] = useState(null);
  const [counsellorNote, setCounsellorNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (attemptId) {
      loadInterpretation();
    }
  }, [attemptId]);

  const loadInterpretation = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await testAPI.getInterpretation(parseInt(attemptId));
      
      // IMPORTANT: Validate overall_percentage from API (calculated once in backend, stored in scores table)
      // Do NOT recalculate - use value directly from backend
      if (!data || typeof data.overall_percentage !== 'number') {
        throw new Error('Invalid interpretation data: missing overall_percentage');
      }
      
      if (data.overall_percentage < 0 || data.overall_percentage > 100) {
        throw new Error(`Invalid score value: ${data.overall_percentage}. Must be between 0-100.`);
      }
      
      setInterpretation(data);
      
      // Load counsellor note if available
      try {
        const note = await counsellorAPI.getNote(parseInt(attemptId));
        setCounsellorNote(note);
        setNoteText(note ? note.notes : '');
      } catch (e) {
        // Note might not exist, that's okay
        setCounsellorNote(null);
        setNoteText('');
      }
    } catch (err) {
      setError(err.message || 'Failed to load interpretation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      setDownloading(true);
      await generatePDF(reportRef.current, user, interpretation, counsellorNote);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!attemptId || !noteText.trim()) return;

    try {
      setSavingNote(true);
      setError('');
      const savedNote = await counsellorAPI.saveNote(parseInt(attemptId), noteText);
      setCounsellorNote(savedNote);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const isCounsellor = user?.role === 'COUNSELLOR';
  const canEditNote = isCounsellor;
  const hasNoteChanged = counsellorNote ? noteText !== counsellorNote.notes : noteText.trim() !== '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200/60 dark:border-slate-700">
            <div className="animate-pulse space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                <div className="flex justify-center gap-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                </div>
              </div>
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !interpretation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 max-w-md w-full text-center">
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Error Loading Results</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/student')}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interpretation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Result Header */}
        <ResultHeader
          user={user}
          interpretation={interpretation}
          onDownloadPDF={handleDownloadPDF}
          downloading={downloading}
        />

        {/* Report Content - Hidden for PDF generation */}
        <div ref={reportRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-slate-200/60 dark:border-slate-700 print:shadow-none print:border-none transition-colors duration-300 space-y-8">
          {/* Score Summary */}
          <ScoreSummary interpretation={interpretation} />

          {/* Readiness Status and Risk Level */}
          <ReadinessStatus
            readinessStatus={interpretation.readiness_status}
            readinessExplanation={interpretation.readiness_explanation}
            riskLevel={interpretation.risk_level}
            riskExplanation={interpretation.risk_explanation}
          />

          {/* What This Means for You */}
          <WhatThisMeans
            readinessStatus={interpretation.readiness_status}
            overallPercentage={interpretation.overall_percentage}
            careerDirection={interpretation.career_direction}
          />

          {/* Next Steps Summary */}
          <NextStepsSummary
            readinessStatus={interpretation.readiness_status}
            roadmap={interpretation.roadmap}
          />

          {/* Skill Readiness Chart */}
          <SkillReadinessChart interpretation={interpretation} />

          {/* Career Direction */}
          {interpretation.career_direction && (
            <CareerDirection 
              careerDirection={interpretation.career_direction}
              careerDirectionReason={interpretation.career_direction_reason}
            />
          )}

          {/* Career Matches */}
          <CareerMatches 
            careerClusters={interpretation.career_clusters}
            overallPercentage={interpretation.overall_percentage}
            readinessStatus={interpretation.readiness_status}
          />

          {/* AI Insight */}
          <AIInsight summary={interpretation.summary} />

          {/* Action Plan */}
          <ActionPlan actionPlan={interpretation.action_plan} roadmap={interpretation.roadmap} />

          {/* Counsellor Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Counsellor's Expert Notes</h2>
            </div>

            {counsellorNote ? (
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    By {counsellorNote.counsellor_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(counsellorNote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {counsellorNote.notes}
                </p>
              </div>
            ) : (
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 border border-purple-200 dark:border-purple-800 text-center">
                <p className="text-slate-500 dark:text-slate-400 italic">
                  No counsellor notes added yet
                </p>
              </div>
            )}

            {canEditNote && (
              <div className="mt-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your professional notes and insights about this student's assessment results..."
                  className="w-full px-4 py-3 rounded-lg border border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-h-[150px] resize-y"
                />
                <div className="mt-4 flex items-center justify-between">
                  {noteSaved && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Notes saved successfully</span>
                  )}
                  <motion.button
                    onClick={handleSaveNote}
                    disabled={savingNote || !hasNoteChanged || !noteText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingNote ? 'Saving...' : counsellorNote ? 'Update Notes' : 'Save Notes'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Parent-Friendly Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Important Information for Parents and Students
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>What this report means:</strong> This assessment provides insights into the student's current career exploration stage, strengths, and areas for development. The results are based on the student's responses and reflect their current level of readiness for career decision-making.
                </p>
                <p>
                  <strong>What this report does NOT mean:</strong> This is not a test of intelligence or ability. A lower score does not indicate failure or lack of potential. It simply means the student is in an earlier stage of career exploration and needs more time to develop clarity.
                </p>
                <p>
                  <strong>Next steps:</strong> The roadmap provided in this report offers a clear path forward. Work with a qualified career counsellor to understand these results better and create a personalized plan. Remember, career development is a journey, not a destination.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-4">
                  This assessment is designed to provide general career guidance and insights. Results are intended for informational purposes only and should not be considered as definitive career decisions or professional diagnoses. We strongly recommend consulting with a qualified career counsellor to discuss these results in detail.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
