import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: IconComponent, 
  gradient, 
  bgColor, 
  progressColor, 
  progressWidth 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-xl`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
      <div className={`${bgColor} rounded-full h-2`}>
        <div className={`${progressColor} h-2 rounded-full ${progressWidth} animate-pulse`}></div>
      </div>
    </div>
  );
};

export default StatsCard;