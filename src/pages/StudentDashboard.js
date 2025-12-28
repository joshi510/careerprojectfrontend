import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import authService from '../services/auth';
import { testAPI } from '../services/api';

function StudentDashboard() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [loadingInterpretation, setLoadingInterpretation] = useState(false);

  const user = authService.getUser();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await testAPI.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await testAPI.startTest();
      setAttemptId(data.attempt_id);
      setTestStarted(true);
    } catch (err) {
      setError(err.message || 'Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
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
      const answersArray = questions.map(q => ({
        question_id: q.question_id,
        selected_option: answers[q.question_id] || 'C'
      }));

      await testAPI.submitAnswers(attemptId, answersArray);
      setTestCompleted(true);
      // Navigate to result page after a short delay
      setTimeout(() => {
        window.location.href = `/result/${attemptId}`;
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const loadInterpretation = async () => {
    if (!attemptId) return;
    try {
      setLoadingInterpretation(true);
      const data = await testAPI.getInterpretation(attemptId);
      setInterpretation(data);
    } catch (err) {
      setError(err.message || 'Failed to load interpretation');
    } finally {
      setLoadingInterpretation(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (loading && !testStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Career Assessment</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Welcome, {user?.full_name || 'Student'}!
            </h2>
            <p className="text-slate-600 mb-6">
              This assessment will help identify your career strengths and provide personalized guidance.
              You'll answer {questions.length} questions. Take your time and answer honestly.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={startTest}
              disabled={loading || questions.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Assessment Results</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>

          {loadingInterpretation ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating your personalized interpretation...</p>
            </div>
          ) : interpretation ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Summary</h2>
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
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Action Plan (12-24 Months)</h3>
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
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
              <p className="text-slate-600">No interpretation available yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
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
                const isSelected = answers[currentQuestion?.question_id] === option.value;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(currentQuestion?.question_id, option.value)}
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
