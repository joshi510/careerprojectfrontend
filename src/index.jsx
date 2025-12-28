import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Apply dark mode class immediately on page load to prevent flash of light mode
const savedTheme = localStorage.getItem('theme');
const shouldBeDark = savedTheme ? savedTheme === 'dark' : true; // Default to dark mode
if (shouldBeDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

