import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TestFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState('');

  // Sample question data - replace with API call
  const questions = [
    {
      id: 1,
      question_text: "I enjoy solving complex problems and puzzles",
      question_type: "LIKERT_SCALE",
      options: "1,2,3,4,5",
      category: "analytical"
    },
    {
      id: 2,
      question_text: "I prefer working in a team rather than alone",
      question_type: "LIKERT_SCALE",
      options: "1,2,3,4,5",
      category: "social"
    },
    {
      id: 3,
      question_text: "I feel comfortable taking on leadership roles",
      question_type: "LIKERT_SCALE",
      options: "1,2,3,4,5",
      category: "leadership"
    }
  ];

  const likertLabels = {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree"
  };

  const handleAnswer = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({
        ...answers,
        [questions[currentQuestion].id]: selectedOption
      });
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption('');
      } else {
        // Submit test
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[questions[currentQuestion - 1].id];
      setSelectedOption(prevAnswer || '');
    }
  };

  const handleSubmit = () => {
    // TODO: Submit answers to API
    console.log('Submitting answers:', answers);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200/60"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 leading-relaxed">
              {question.question_text}
            </h2>

            {question.question_type === "LIKERT_SCALE" && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(value.toString())}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedOption === value.toString()
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-medium">
                        {likertLabels[value]}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === value.toString()
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300'
                      }`}>
                        {selectedOption === value.toString() && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentQuestion === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!selectedOption}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              selectedOption
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default TestFlow;

