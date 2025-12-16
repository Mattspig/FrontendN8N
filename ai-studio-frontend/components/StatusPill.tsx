import React from 'react';

interface StatusPillProps {
  type: 'intent' | 'confidence' | 'action';
  value: string;
  score?: number;
}

const StatusPill: React.FC<StatusPillProps> = ({ type, value, score }) => {
  let bgClass = 'bg-gray-100';
  let textClass = 'text-gray-600';
  let dotClass = 'bg-gray-400';

  if (type === 'intent') {
    switch (value) {
      case 'Buyer':
        bgClass = 'bg-blue-50';
        textClass = 'text-blue-700';
        dotClass = 'bg-blue-500';
        break;
      case 'Seller':
        bgClass = 'bg-purple-50';
        textClass = 'text-purple-700';
        dotClass = 'bg-purple-500';
        break;
      case 'Renter':
        bgClass = 'bg-orange-50';
        textClass = 'text-orange-700';
        dotClass = 'bg-orange-500';
        break;
      default:
        bgClass = 'bg-gray-100';
        textClass = 'text-gray-600';
        dotClass = 'bg-gray-400';
    }
  } else if (type === 'confidence') {
    // Expect score 0-1 or 0-100. Let's assume passed in as 0-100
    const num = score ?? 0;
    if (num >= 85) {
      bgClass = 'bg-emerald-50';
      textClass = 'text-emerald-700';
    } else if (num >= 50) {
      bgClass = 'bg-yellow-50';
      textClass = 'text-yellow-700';
    } else {
      bgClass = 'bg-red-50';
      textClass = 'text-red-700';
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass} ${textClass}`}>
        {value} ({num}%)
      </span>
    );
  } else if (type === 'action') {
    if (value === 'Auto-replied') {
      bgClass = 'bg-emerald-100';
      textClass = 'text-emerald-800';
      return (
         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass} ${textClass}`}>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
          {value}
        </span>
      )
    } else {
      bgClass = 'bg-amber-100';
      textClass = 'text-amber-800';
       return (
         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass} ${textClass}`}>
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>
          {value}
        </span>
      )
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass} ${textClass} border border-transparent`}>
       {type === 'intent' && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>}
      {value}
    </span>
  );
};

export default StatusPill;