import React from 'react';
import { BarChart3 } from 'lucide-react';

const TrendChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
        Trend Data Bulanan
      </h3>
      <div className="h-64 flex items-end space-x-3">
        {data.map((dataPoint, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col space-y-1">
              <div 
                className="bg-gradient-to-t from-green-400 to-green-500 rounded-t transition-all duration-1000 hover:scale-105"
                style={{ height: `${(dataPoint.newData / 800) * 100}px` }}
                title={`Data Baru: ${dataPoint.newData}`}
              ></div>
              <div 
                className="bg-gradient-to-t from-gray-400 to-gray-500 rounded-b transition-all duration-1000 hover:scale-105"
                style={{ height: `${(dataPoint.oldData / 1800) * 150}px` }}
                title={`Data Lama: ${dataPoint.oldData}`}
              ></div>
            </div>
            <span className="text-sm text-gray-600 mt-2 font-medium">{dataPoint.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Data Baru</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Data Lama</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;