import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, testAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import ReadinessChart from '../../components/ReadinessChart';
import CareerClusterChart from '../../components/CareerClusterChart';
import CareerClusterBarChart from '../../components/CareerClusterBarChart';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCounsellors: 0,
    totalAttempts: 0,
    completedAttempts: 0,
    averageScore: 0
  });
  const [readinessData, setReadinessData] = useState({
    'READY': 0,
    'PARTIALLY READY': 0,
    'NOT READY': 0
  });
  const [careerClusterData, setCareerClusterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const analytics = await adminAPI.getAnalytics();
      
      setStats({
        totalStudents: analytics.total_students || 0,
        totalCounsellors: analytics.total_counsellors || 0,
        totalAttempts: analytics.total_attempts || 0,
        completedAttempts: analytics.completed_attempts || 0,
        averageScore: analytics.average_score || 0
      });
      
      setReadinessData(analytics.readiness_distribution || readinessData);
      setCareerClusterData(analytics.career_cluster_distribution || {});
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Loading analytics..." />
      </>
    );
  }

  if (error && Object.values(stats).every(v => v === 0)) {
    return (
      <>
        <Navbar />
        <Error message={error} onRetry={loadAnalytics} />
      </>
    );
  }

  const totalReadiness = Object.values(readinessData).reduce((a, b) => a + b, 0);
  const totalCareerClusters = Object.values(careerClusterData).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome, {user?.full_name || 'Admin'}</p>
        </div>

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Counsellors</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCounsellors}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Attempts</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Tests</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.completedAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.averageScore > 0 ? `${stats.averageScore.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Readiness Distribution</h2>
            {totalReadiness > 0 ? (
              <ReadinessChart data={readinessData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <p className="text-sm">No readiness data available</p>
                  <p className="text-xs mt-2 text-slate-400 dark:text-slate-500">Complete test attempts will appear here</p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Career Cluster Distribution</h2>
            {Object.keys(careerClusterData).length > 0 ? (
              <CareerClusterBarChart data={careerClusterData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <p className="text-sm">No career cluster data available</p>
                  <p className="text-xs mt-2 text-slate-400 dark:text-slate-500">Career recommendations will appear here</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <motion.button 
                className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors btn-hover"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Manage Users</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View and manage user accounts</p>
              </motion.button>
              <motion.button 
                className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors btn-hover"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Question Bank</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage assessment questions</p>
              </motion.button>
              <motion.button 
                className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors btn-hover"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Export Reports</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Download analytics and reports</p>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">System Information</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Platform Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">Operational</span>
              </div>
              <div className="flex justify-between">
                <span>AI Interpretation</span>
                <span className="font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Tests</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{stats.completedAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span>Career Recommendations</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{totalCareerClusters}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
