import React from 'react';
import { AlertCircle } from 'lucide-react';

const PieChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <AlertCircle className="h-6 w-6 mr-3 text-purple-600" />
        Distribusi Data
      </h3>
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-500 opacity-80"></div>
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"
            style={{
              clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 38%, 85% 85%, 50% 50%)'
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">35%</p>
              <p className="text-sm text-white opacity-90">Data Baru</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-6 mt-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded mr-3"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;