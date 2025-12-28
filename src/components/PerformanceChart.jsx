import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function PerformanceChart({ data }) {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#475569' : '#e2e8f0';
  const axisColor = isDark ? '#475569' : '#cbd5e1';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  const chartData = [
    { name: 'Strengths', value: data.strengths, fill: '#10b981' },
    { name: 'Growth Areas', value: data.weaknesses, fill: '#f59e0b' },
    { name: 'Career Clusters', value: data.careerClusters, fill: '#3b82f6' },
    { name: 'Action Steps', value: data.actionPlanSteps, fill: '#8b5cf6' }
  ];

  return (
    <div style={{ width: '100%', height: '250px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="name"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: axisColor }}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: axisColor }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: isDark ? '#f1f5f9' : '#1e293b'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: textColor }} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
