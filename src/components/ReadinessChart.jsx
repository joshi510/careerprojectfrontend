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

function ReadinessChart({ data }) {
  const chartData = [
    { name: 'READY', value: data.READY || 0, fill: '#10b981' },
    { name: 'PARTIALLY READY', value: data['PARTIALLY READY'] || 0, fill: '#f59e0b' },
    { name: 'NOT READY', value: data['NOT READY'] || 0, fill: '#ef4444' }
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReadinessChart;

