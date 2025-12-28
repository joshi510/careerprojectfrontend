import authService from './auth';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = authService.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const testAPI = {
  getQuestions: () => apiRequest('/test/questions'),
  startTest: () => apiRequest('/test/start', { method: 'POST' }),
  submitAnswers: (attemptId, answers) => apiRequest('/test/submit', {
    method: 'POST',
    body: JSON.stringify({
      attempt_id: Number(attemptId),
      answers: answers.map(ans => ({
        question_id: Number(ans.question_id),
        selected_option: String(ans.selected_option)
      }))
    })
  }),
  getInterpretation: (attemptId) => apiRequest(`/test/interpretation/${attemptId}`),
  // Section-wise endpoints
  getSections: (attemptId = null) => {
    if (attemptId) {
      return apiRequest(`/test/sections?attempt_id=${attemptId}`);
    }
    return apiRequest('/test/sections');
  },
  getCurrentSection: (attemptId) => apiRequest(`/test/${attemptId}/sections/current`),
  getSectionQuestions: (attemptId, sectionId) => apiRequest(`/test/sections/${sectionId}/questions?attempt_id=${attemptId}`),
  startSection: (attemptId, sectionId) => apiRequest(`/test/sections/${sectionId}/start?attempt_id=${attemptId}`, { method: 'POST' }),
  submitSection: (sectionId, attemptId, answers) => apiRequest(`/test/sections/${sectionId}/submit`, {
    method: 'POST',
    body: JSON.stringify({
      attempt_id: Number(attemptId),
      section_id: Number(sectionId),
      answers: answers.map(ans => ({
        question_id: Number(ans.question_id),
        selected_option: String(ans.selected_option)
      }))
    })
  }),
  pauseSection: (attemptId, sectionId) => apiRequest(`/test/sections/${sectionId}/pause?attempt_id=${attemptId}`, { method: 'POST' }),
  resumeSection: (attemptId, sectionId) => apiRequest(`/test/sections/${sectionId}/resume?attempt_id=${attemptId}`, { method: 'POST' }),
  getSectionTimer: (attemptId, sectionId) => apiRequest(`/test/sections/${sectionId}/timer?attempt_id=${attemptId}`),
  getTestStatus: (attemptId) => apiRequest(`/test/${attemptId}/status`),
  completeTest: (attemptId, autoSubmit = false) => {
    const url = autoSubmit 
      ? `/test/${attemptId}/complete?auto_submit=true`
      : `/test/${attemptId}/complete`;
    return apiRequest(url, { method: 'POST' });
  }
};

export const studentAPI = {
  getResults: () => apiRequest('/student/result/')
};

export const adminAPI = {
  getAnalytics: () => apiRequest('/admin/analytics')
};

export const counsellorAPI = {
  getNote: (attemptId) => apiRequest(`/counsellor/notes/${attemptId}`),
  saveNote: (attemptId, notes) => apiRequest('/counsellor/notes', {
    method: 'POST',
    body: JSON.stringify({
      test_attempt_id: attemptId,
      notes
    })
  })
};

export default apiRequest;
