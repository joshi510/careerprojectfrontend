import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testAPI } from '../services/api';

function SectionSelection({ onStartSection, attemptId, onStartTest }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingTest, setStartingTest] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // Store backend test status

  useEffect(() => {
    loadSections();
    if (attemptId) {
      loadTestStatus();
    }
  }, [attemptId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      // Get sections with progress status if attemptId is provided
      const data = await testAPI.getSections(attemptId);
      // Handle both response formats: {sections: [...]} or [...]
      const sectionsList = Array.isArray(data) ? data : (data.sections || []);
      console.log('Loaded sections:', sectionsList.length, sectionsList); // Debug log
      setSections(sectionsList.sort((a, b) => a.order_index - b.order_index));
    } catch (err) {
      setError(err.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const loadTestStatus = async () => {
    if (!attemptId) return;
    try {
      const status = await testAPI.getTestStatus(attemptId);
      console.log('Loaded test status:', status);
      setTestStatus(status);
      // Reload sections after getting status to ensure UI is in sync
      loadSections();
    } catch (err) {
      console.error('Failed to load test status:', err);
      // Don't set error - this is not critical for section selection
    }
  };

  const isSectionUnlocked = (section) => {
    if (section.order_index === 1) return true; // Section 1 always unlocked
    // Find previous section
    const prevSection = sections.find(s => s.order_index === section.order_index - 1);
    // Check if previous section is completed (handle both 'completed' and 'COMPLETED' status)
    return prevSection && (prevSection.status === 'completed' || prevSection.status === 'COMPLETED');
  };

  const handleStartSection = async (section) => {
    if (!isSectionUnlocked(section)) return;
    
    try {
      setError('');
      
      // For Section 1, call /test/start first to create/get test attempt
      let currentAttemptId = attemptId;
      if (section.order_index === 1 && !currentAttemptId) {
        setStartingTest(true);
        try {
          const startData = await testAPI.startTest();
          currentAttemptId = Number(startData.test_attempt_id);
          // Notify parent to update attemptId
          if (onStartTest) {
            onStartTest(currentAttemptId);
          }
        } catch (err) {
          setError(err.message || 'Failed to start test');
          setStartingTest(false);
          return;
        } finally {
          setStartingTest(false);
        }
      }
      
      if (!currentAttemptId) {
        setError('Test attempt not initialized. Please refresh the page.');
        return;
      }
      
      // Start the section (this will initialize progress and timer)
      await testAPI.startSection(currentAttemptId, section.id);
      
      // Fetch questions BEFORE navigating to test screen
      setLoadingQuestions(true);
      try {
        const questions = await testAPI.getSectionQuestions(currentAttemptId, section.id);
        // Only navigate after questions are loaded
        if (questions && questions.length > 0) {
          onStartSection(section);
          // Reload test status after starting section to update progress
          if (currentAttemptId) {
            loadTestStatus();
          }
        } else {
          setError('No questions found for this section');
        }
      } catch (err) {
        setError(err.message || 'Failed to load questions');
      } finally {
        setLoadingQuestions(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to start section');
      setLoadingQuestions(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Assessment Sections
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Complete each section in order. You must finish one section before starting the next.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => {
          const unlocked = isSectionUnlocked(section);
          const isCompleted = section.status === 'completed' || section.status === 'COMPLETED';
          const isInProgress = section.status === 'IN_PROGRESS' || section.status === 'available';
          
          // Show ALL 5 sections - sections 2-5 will be locked/disabled until previous is completed
          // Do NOT hide sections - show them all but lock sections 2-5

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-xl p-6 border-2 transition-all ${
                unlocked
                  ? isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                    : isInProgress
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 opacity-60'
              }`}
            >
              {/* Section Number Badge */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    unlocked
                      ? isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-slate-400 text-white'
                  }`}
                >
                  {section.order_index}
                </div>
              </div>

              {/* Lock Icon for locked sections */}
              {!unlocked && (
                <div className="absolute top-4 left-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}

              <div className="mt-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {section.name}
                </h3>
                {section.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {section.description}
                  </p>
                )}

                {/* Question Count and Time Info */}
                <div className="mb-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">{section.question_count || 10} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{Math.floor((section.time_limit || 360) / 60)} minutes</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {isCompleted && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      ✓ Completed
                    </span>
                  )}
                  {isInProgress && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      In Progress
                    </span>
                  )}
                  {!unlocked && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      🔒 Locked
                    </span>
                  )}
                </div>

                {/* Action Button */}
                {unlocked && (
                  <button
                    onClick={() => handleStartSection(section)}
                    disabled={isCompleted || startingTest || loadingQuestions}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      isCompleted
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                        : startingTest || loadingQuestions
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {startingTest ? 'Starting...' : loadingQuestions ? 'Loading questions...' : isCompleted ? 'Completed' : isInProgress ? 'Continue' : 'Start'}
                  </button>
                )}
                {!unlocked && (
                  <div className="w-full py-3 px-4 rounded-lg font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-center cursor-not-allowed">
                    Complete previous section to unlock
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {(() => {
              // Use backend data if available, otherwise fallback to sections status
              if (testStatus && testStatus.completed_sections) {
                return `${testStatus.completed_sections.length} of ${testStatus.total_sections || sections.length} sections completed`;
              }
              return `${sections.filter(s => s.status === 'COMPLETED').length} of ${sections.length} sections completed`;
            })()}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${(() => {
                // Use backend data if available, otherwise fallback to sections status
                if (testStatus && testStatus.completed_sections && testStatus.total_sections) {
                  return (testStatus.completed_sections.length / testStatus.total_sections) * 100;
                }
                return sections.length > 0 
                  ? (sections.filter(s => s.status === 'COMPLETED').length / sections.length) * 100
                  : 0;
              })()}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SectionSelection;

