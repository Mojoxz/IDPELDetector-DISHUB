import React from 'react';
import { FileText } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FileText className="h-6 w-6 mr-3 text-indigo-600" />
        Aktivitas Terbaru
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                activity.color === 'green' ? 'bg-green-100 text-green-600' :
                activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.file} • {activity.count} records</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;