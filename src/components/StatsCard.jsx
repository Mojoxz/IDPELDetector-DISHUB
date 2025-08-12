import React from 'react';

const StatsCard = ({ title, value, icon: Icon, gradient, bgColor, progressColor, progressWidth, darkMode }) => {
  return (
    <div className={`rounded-2xl p-6 shadow-lg border transform hover:scale-105 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-100 hover:shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
        </div>
        <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="text-sm font-medium">{title}</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        </div>
      </div>
      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div className={`h-2 rounded-full ${progressColor} ${progressWidth} transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export default StatsCard;
