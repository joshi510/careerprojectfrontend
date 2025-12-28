import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { testAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import SectionTestFlow from '../../components/SectionTestFlow';
import SectionSelection from '../../components/SectionSelection';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [useSections, setUseSections] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSectionSelection, setShowSectionSelection] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  // Disable body scroll when test is active (section-based flow)
  useEffect(() => {
    if (useSections && attemptId && selectedSection) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [useSections, attemptId, selectedSection]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      // Check if sections are available
      const sectionsData = await testAPI.getSections();
      if (sectionsData && sectionsData.sections && sectionsData.sections.length > 0) {
        setUseSections(true);
        setSections(sectionsData.sections);
        
        // Check if there's an existing in-progress test attempt
        // Do NOT auto-start - wait for user to click "Start" on Section 1
        // The get_sections endpoint will show sections with their status
        // If there's an existing attempt, it will be shown in the section status
      } else {
        // Fallback to old flow if sections not available
        setUseSections(false);
        const data = await testAPI.getQuestions();
        setQuestions(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSection = (section) => {
    setSelectedSection(section);
    setShowSectionSelection(false);
  };
  
  const handleStartTest = (newAttemptId) => {
    setAttemptId(newAttemptId);
    setTestStarted(true);
  };

  const handleSectionComplete = async () => {
    // After section completion, reload sections to check status
    // BUT do NOT return to selection screen - SectionTestFlow handles auto-transition
    try {
      const data = await testAPI.getSections(attemptId);
      // Handle both response formats: {sections: [...]} or [...]
      const sectionsList = Array.isArray(data) ? data : (data.sections || []);
      setSections(sectionsList);
      // Check if all sections completed
      const allCompleted = sectionsList.every(s => s.status === 'COMPLETED');
      if (allCompleted) {
        // All done, SectionTestFlow will call onComplete
        return;
      }
      // Do NOT show selection screen - let SectionTestFlow auto-transition to next section
      // The auto-transition happens in SectionTestFlow itself
    } catch (err) {
      console.error('Failed to reload sections:', err);
    }
  };

  const handleAnswer = (questionId, option) => {
    const qId = Number(questionId);
    setAnswers({
      ...answers,
      [qId]: option
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Ensure all questions have answers and convert to proper format
      const answersArray = questions.map(q => {
        const questionId = Number(q.question_id);
        const selectedOption = String(answers[questionId] || answers[q.question_id] || 'C');
        return {
          question_id: questionId,
          selected_option: selectedOption
        };
      });

      // Ensure attemptId is a number
      const attemptIdNum = Number(attemptId);
      
      if (!attemptIdNum || isNaN(attemptIdNum)) {
        throw new Error('Invalid test attempt ID');
      }

      await testAPI.submitAnswers(attemptIdNum, answersArray);
      setTestCompleted(true);
      setTimeout(() => {
        navigate(`/result/${attemptIdNum}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !testStarted && questions.length === 0) {
    return <Loading message="Loading questions..." />;
  }

  if (error && !testStarted && questions.length === 0) {
    return <Error message={error} onRetry={initializeDashboard} />;
  }

  // Show loading while initializing
  if (loading && !testStarted && !useSections) {
    return <Loading message="Loading assessment..." />;
  }

  // Show error if initialization failed
  if (error && !testStarted && !useSections) {
    return <Error message={error} onRetry={initializeDashboard} />;
  }

  // Show section selection immediately after login/registration (no "Start Assessment" button)
  // Show even if attemptId is not set yet - SectionSelection will handle starting test on Section 1 click
  if (useSections && showSectionSelection && !selectedSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SectionSelection
            attemptId={attemptId}
            onStartSection={handleStartSection}
            onStartTest={handleStartTest}
          />
        </div>
      </div>
    );
  }

  // Use section-based test flow when a section is selected
  if (useSections && attemptId && selectedSection) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 overflow-hidden px-4 py-4">
          <SectionTestFlow
            attemptId={attemptId}
            initialSection={selectedSection}
            onSectionComplete={handleSectionComplete}
            onComplete={(testId) => {
              document.body.style.overflow = 'unset';
              setTestCompleted(true);
              // Use testId from response if provided, otherwise use attemptId
              const finalTestId = testId || attemptId;
              setTimeout(() => {
                navigate(`/result/${finalTestId}`);
              }, 1000);
            }}
          />
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Test Submitted Successfully!</h2>
            <p className="text-slate-600">Redirecting to your results...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {currentQuestion?.question_text}
          </h2>

          <div className="space-y-3 mb-6">
            {(() => {
              // Safely handle both array format and legacy option_a/b/c/d format
              let options = [];
              if (Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0) {
                options = currentQuestion.options
                  .filter(opt => opt && opt.text && opt.text.trim() !== '')
                  .slice(0, 4)
                  .map(opt => ({
                    value: opt.key || opt.value || 'A',
                    text: opt.text || ''
                  }));
              } else {
                // Fallback to legacy format
                options = [
                  { value: 'A', text: currentQuestion?.option_a },
                  { value: 'B', text: currentQuestion?.option_b },
                  { value: 'C', text: currentQuestion?.option_c },
                  { value: 'D', text: currentQuestion?.option_d }
                ].filter(opt => opt.text != null && opt.text.trim() !== '').slice(0, 4);
              }
              
              return options.map((option, idx) => {
                const qId = Number(currentQuestion?.question_id);
                const isSelected = answers[qId] === option.value;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(Number(currentQuestion?.question_id), option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-slate-900">
                      {option.value}) {option.text}
                    </span>
                  </button>
                );
              });
            })()}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={loading || Object.keys(answers).length !== questions.length}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Test'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboard;

