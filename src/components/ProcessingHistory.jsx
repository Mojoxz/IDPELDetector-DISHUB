import React from 'react';
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ProcessingHistory = ({ history }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    return seconds < 1 ? `${Math.round(seconds * 1000)}ms` : `${seconds}s`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Clock className="h-6 w-6 mr-3 text-indigo-600" />
        Riwayat Pemrosesan
      </h3>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada riwayat pemrosesan</p>
          <p className="text-sm text-gray-400">Upload dan proses file pertama Anda!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  item.newDataFound > 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{item.fileNew}</p>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      #{item.id.toString().slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{item.totalProcessed} total</span>
                    <span className="text-green-600 font-medium">{item.newDataFound} baru</span>
                    <span>{formatDuration(item.processingTime)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(item.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            Menampilkan {Math.min(history.length, 20)} dari {history.length} riwayat pemrosesan
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingHistory;