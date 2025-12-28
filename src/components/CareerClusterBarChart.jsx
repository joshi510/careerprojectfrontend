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

function CareerClusterBarChart({ data }) {
  // Convert object to array and sort by value
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value,
      fullName: name
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 clusters

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <p className="text-sm">No career cluster data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: '#64748b', fontSize: 11 }}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value, name, props) => [value, props.payload.fullName]}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CareerClusterBarChart;

