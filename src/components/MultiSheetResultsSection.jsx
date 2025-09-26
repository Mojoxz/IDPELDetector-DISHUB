import React, { useState } from 'react';
import { Download, FileSpreadsheet, BarChart3, TrendingUp } from 'lucide-react';

const MultiSheetResultsSection = ({ result, onDownload, darkMode }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const getFileName = (type) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    switch(type) {
      case 'multisheet': return `idpel_terbaru_multisheet_${timestamp}.xlsx`;
      case 'summary': return `summary_multisheet_${timestamp}.xlsx`;
      case 'new-only': return `data_baru_only_${timestamp}.xlsx`;
      default: return `idpel_result_${timestamp}.xlsx`;
    }
  };

  const getSheetColor = (sheetName) => {
    const colors = {
      'DMP': 'bg-blue-500',
      'DKP': 'bg-green-500', 
      'NGL': 'bg-purple-500',
      'RKT': 'bg-orange-500',
      'GDN': 'bg-red-500'
    };
    return colors[sheetName] || 'bg-gray-500';
  };

  const calculateGrowthPercentage = (newData, totalData) => {
    if (totalData === 0) return 0;
    return ((newData / totalData) * 100).toFixed(1);
  };

  return (
    <div className={`rounded-2xl shadow-2xl border transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className={`p-8 border-b transition-colors duration-300 ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-2">
              <FileSpreadsheet className={`h-6 w-6 mr-3 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📊 Hasil Analisis Multi-Sheet
              </h2>
            </div>
            <p className={`text-sm flex items-center transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="mr-2">⏱️</span>
              Proses selesai dalam {result.processingTime}s • {result.processedSheets.length} sheet diproses
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              +{result.totalNewAll.toLocaleString()}
            </div>
            <div className={`text-sm font-medium transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              IDPEL Baru Total
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <FileSpreadsheet className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="ml-3">
                <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {result.processedSheets.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sheet
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-200'}`}>
                <TrendingUp className={`h-5 w-5 ${darkMode ? 'text-green-300' : 'text-green-700'}`} />
              </div>
              <div className="ml-3">
                <div className={`text-xl font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  {result.totalNewAll.toLocaleString()}
                </div>
                <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Baru
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-200'}`}>
                <BarChart3 className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`} />
              </div>
              <div className="ml-3">
                <div className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  {result.totalProcessedAll.toLocaleString()}
                </div>
                <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Total
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-800' : 'bg-purple-200'}`}>
                <span className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  %
                </span>
              </div>
              <div className="ml-3">
                <div className={`text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  {calculateGrowthPercentage(result.totalNewAll, result.totalProcessedAll)}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Growth
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
              activeTab === 'details'
                ? 'bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Detail Per Sheet
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Visual Chart */}
            <div className={`p-6 rounded-xl border transition-colors duration-300 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Distribusi Data Per Sheet
              </h3>
              <div className="space-y-3">
                {result.processedSheets.map(sheetName => {
                  const sheetData = result.sheetResults[sheetName];
                  const percentage = calculateGrowthPercentage(sheetData.totalNew, sheetData.totalAll);
                  const widthPercentage = sheetData.totalAll > 0 ? (sheetData.totalNew / result.totalNewAll * 100) : 0;
                  
                  return (
                    <div key={sheetName} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getSheetColor(sheetName)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {sheetName}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {sheetData.totalNew.toLocaleString()} / {sheetData.totalAll.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full ${getSheetColor(sheetName)}`}
                            style={{ width: `${Math.max(widthPercentage, 2)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onDownload(result, getFileName('multisheet'), true)}
                className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Lengkap
              </button>
              <button
                onClick={() => onDownload(result.newData || [], getFileName('new-only'), true)}
                className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Data Baru Saja
              </button>
              <button
                onClick={() => onDownload(result, getFileName('summary'), true)}
                className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Summary Report
              </button>
            </div>

            <div className="text-center">
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                💡 File Excel berisi: Summary sheet, data baru per sheet, dan gabungan semua data baru (format seperti Python script)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.processedSheets.map(sheetName => {
                const sheetData = result.sheetResults[sheetName];
                const percentage = calculateGrowthPercentage(sheetData.totalNew, sheetData.totalAll);
                
                return (
                  <div key={sheetName} className={`p-6 rounded-xl border transition-colors duration-300 hover:shadow-lg ${
                    darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${getSheetColor(sheetName)}`}></div>
                        <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {sheetName}
                        </h4>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sheetData.totalNew > 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {percentage}%
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total Data:
                        </span>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {sheetData.totalAll.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Data Baru:
                        </span>
                        <span className={`font-bold ${
                          sheetData.totalNew > 0 
                            ? (darkMode ? 'text-green-400' : 'text-green-600')
                            : (darkMode ? 'text-gray-400' : 'text-gray-600')
                        }`}>
                          {sheetData.totalNew > 0 ? `+${sheetData.totalNew.toLocaleString()}` : 'Tidak ada'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status:
                        </span>
                        <span className={`text-sm font-medium ${
                          sheetData.totalNew > 0 
                            ? (darkMode ? 'text-green-400' : 'text-green-600')
                            : (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                        }`}>
                          {sheetData.totalNew > 0 ? '✅ Ada data baru' : '📋 Tidak ada perubahan'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            sheetData.totalNew > 0 ? getSheetColor(sheetName) : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs mt-1 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Growth Rate: {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Cards for Details Tab */}
            <div className={`mt-6 p-4 rounded-xl border transition-colors duration-300 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <BarChart3 className="h-5 w-5 mr-2" />
                Ringkasan Detail
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {result.processedSheets.filter(sheet => result.sheetResults[sheet].totalNew > 0).length}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sheet dengan data baru
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {Math.max(...result.processedSheets.map(sheet => result.sheetResults[sheet].totalNew)).toLocaleString()}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Data terbanyak (1 sheet)
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {(result.totalNewAll / result.processedSheets.length).toFixed(0)}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rata-rata per sheet
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {calculateGrowthPercentage(result.totalNewAll, result.totalProcessedAll)}%
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Growth keseluruhan
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSheetResultsSection;