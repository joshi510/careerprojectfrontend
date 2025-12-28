const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error(
    "VITE_API_URL is not defined. Please set it in Netlify Environment Variables."
  );
}

const API_BASE = 'http://127.0.0.1:8001';

class AuthService {
  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    this.setAuth(data.access_token, data.user);
    return data;
  }

  async register(email, password, fullName, mobileNumber, education) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        mobile_number: mobileNumber,
        education: education
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    this.setAuth(data.access_token, data.user);
    return data;
  }

  logout() {
    this.clearAuth();
  }
}

export default new AuthService();

