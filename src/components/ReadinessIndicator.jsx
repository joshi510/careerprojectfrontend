import React from 'react';

function ReadinessIndicator({ readinessStatus, riskLevel }) {
  const getReadinessColor = (status) => {
    if (status === 'READY') return 'bg-green-500';
    if (status === 'PARTIALLY READY') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskColor = (risk) => {
    if (risk === 'LOW') return 'bg-green-500';
    if (risk === 'MEDIUM') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReadinessPercentage = (status) => {
    if (status === 'READY') return 90;
    if (status === 'PARTIALLY READY') return 60;
    return 30;
  };

  const getRiskPercentage = (risk) => {
    if (risk === 'LOW') return 20;
    if (risk === 'MEDIUM') return 50;
    return 80;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Readiness Level</span>
          <span className="text-sm font-semibold text-slate-900">{readinessStatus}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className={`${getReadinessColor(readinessStatus)} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${getReadinessPercentage(readinessStatus)}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Risk Level</span>
          <span className="text-sm font-semibold text-slate-900">{riskLevel}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className={`${getRiskColor(riskLevel)} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${100 - getRiskPercentage(riskLevel)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ReadinessIndicator;

