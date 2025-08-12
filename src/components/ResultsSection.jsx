import React from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const ResultsSection = ({ result, onDownload }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl mr-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Hasil Analisis Data</h2>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{result.totalAll}</p>
              <p className="text-sm text-gray-600">Total Data</p>
            </div>
          </div>
          <div className="bg-blue-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-full"></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">{result.totalNew}</p>
              <p className="text-sm text-gray-600">Data Baru</p>
            </div>
          </div>
          <div className="bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(result.totalNew / result.totalAll) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-10 w-10 text-gray-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-600">{result.totalAll - result.totalNew}</p>
              <p className="text-sm text-gray-600">Data Lama</p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((result.totalAll - result.totalNew) / result.totalAll) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => onDownload(result.allData, 'semua_data_highlighted.xlsx', true)}
          className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <Download className="h-5 w-5 mr-3" />
          Download Semua Data (Highlighted)
        </button>
        <button
          onClick={() => onDownload(result.newData, 'data_baru_saja.xlsx', false)}
          className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <Download className="h-5 w-5 mr-3" />
          Download Data Baru Saja
        </button>
      </div>

      {/* Processing Info */}
      {result.processingTime && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-8 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-indigo-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Pemrosesan berhasil dalam {result.processingTime} detik</span>
            </div>
            <div className="text-sm text-indigo-600">
              ID: #{result.historyId}
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {result.newData.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-green-600" />
            Preview Data Baru Terdeteksi
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <tr>
                  {Object.keys(result.newData[0]).filter(key => key !== '_IS_NEW_').map(key => (
                    <th key={key} className="px-4 py-3 text-left font-semibold first:rounded-tl-lg last:rounded-tr-lg">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.newData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200">
                    {Object.entries(row).filter(([key]) => key !== '_IS_NEW_').map(([key, value]) => (
                      <td key={key} className="px-4 py-3 text-gray-700">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.newData.length > 5 && (
              <div className="text-center mt-4">
                <p className="text-green-600 font-medium">
                  +{result.newData.length - 5} data baru lainnya tersedia untuk diunduh
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;