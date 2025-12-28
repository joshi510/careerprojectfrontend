import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Questions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question_text: 'I enjoy solving complex problems and puzzles',
      question_type: 'LIKERT_SCALE',
      category: 'analytical',
      is_active: true,
      order_index: 1,
      ai_generated: false
    },
    {
      id: 2,
      question_text: 'I prefer working in a team rather than alone',
      question_type: 'LIKERT_SCALE',
      category: 'social',
      is_active: true,
      order_index: 2,
      ai_generated: false
    },
    {
      id: 3,
      question_text: 'I feel comfortable taking on leadership roles',
      question_type: 'LIKERT_SCALE',
      category: 'leadership',
      is_active: false,
      order_index: 0,
      ai_generated: true
    }
  ]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    // TODO: Call AI API to generate question
    setTimeout(() => {
      setGeneratedQuestion({
        question_text: 'I find it easy to adapt to new situations and changes',
        question_type: 'LIKERT_SCALE',
        category: 'adaptability',
        ai_generated: true
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleApproveQuestion = () => {
    if (generatedQuestion) {
      const newQuestion = {
        id: questions.length + 1,
        ...generatedQuestion,
        is_active: false,
        order_index: 0
      };
      setQuestions([...questions, newQuestion]);
      setGeneratedQuestion(null);
      setShowGenerateModal(false);
    }
  };

  const handleToggleActive = (id) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, is_active: !q.is_active } : q
    ));
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Question Bank</h1>
              <p className="text-slate-600">Manage assessment questions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGenerateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
            >
              Generate with AI
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Questions ({questions.length})</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {questions.map((question, idx) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        {question.category}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        question.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {question.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {question.ai_generated && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-2">
                      {question.question_text}
                    </p>
                    <p className="text-sm text-slate-600">
                      Type: {question.question_type} • Order: {question.order_index}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(question.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        question.is_active
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {question.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-slate-200/60"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">AI Question Generator</h2>
              
              {!generatedQuestion && !isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Generate a new assessment question using AI
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg"
                  >
                    Generate Question
                  </motion.button>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Generating question with AI...</p>
                </div>
              )}

              {generatedQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200/60">
                    <div className="flex items-center mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mr-2">
                        AI Generated
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        {generatedQuestion.category}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-2">
                      {generatedQuestion.question_text}
                    </p>
                    <p className="text-sm text-slate-600">
                      Type: {generatedQuestion.question_type}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleApproveQuestion}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg"
                    >
                      Approve & Add
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setGeneratedQuestion(null);
                        handleGenerateQuestion();
                      }}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
                    >
                      Regenerate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowGenerateModal(false);
                        setGeneratedQuestion(null);
                      }}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Questions;

