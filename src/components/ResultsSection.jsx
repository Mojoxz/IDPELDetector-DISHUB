import React, { useState } from 'react';
import { Download, FileSpreadsheet, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';

const ResultsSection = ({ result, onDownload, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Handle both single and multi-sheet results
  const isMultiSheet = result.mode === 'multisheet';
  const totalNew = isMultiSheet ? result.totalNewAll : result.totalNew;
  const totalAll = isMultiSheet ? result.totalProcessedAll : result.totalAll;

  const getFileName = (type) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    switch(type) {
      case 'highlighted': return `data_dengan_highlight_${timestamp}.xlsx`;
      case 'status': return `data_dengan_status_${timestamp}.xlsx`;
      case 'new_only': return `data_baru_saja_${timestamp}.xlsx`;
      case 'multisheet': return `idpel_terbaru_multisheet_${timestamp}.xlsx`;
      default: return `hasil_analisis_${timestamp}.xlsx`;
    }
  };

  const getSuccessMessage = () => {
    if (totalNew === 0) {
      return "Tidak ditemukan data IDPEL baru";
    }
    return `Ditemukan ${totalNew.toLocaleString()} data IDPEL baru dari total ${totalAll.toLocaleString()} data`;
  };

  const getStatusIcon = () => {
    if (totalNew === 0) {
      return <AlertTriangle className={`h-8 w-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />;
    }
    return <CheckCircle className={`h-8 w-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />;
  };

  return (
    <div className={`rounded-2xl shadow-2xl border transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-4">
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isMultiSheet ? '📊 Hasil Analisis Multi-Sheet' : '✅ Analisis Selesai!'}
              </h2>
              <p className={`text-lg transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getSuccessMessage()}
              </p>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Waktu pemrosesan: {result.processingTime}s
                {isMultiSheet && ` • ${result.processedSheets?.length || 0} sheet diproses`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold transition-colors duration-300 ${
              totalNew > 0 
                ? (darkMode ? 'text-green-400' : 'text-green-600')
                : (darkMode ? 'text-yellow-400' : 'text-yellow-600')
            }`}>
              {totalNew > 0 ? `+${totalNew.toLocaleString()}` : '0'}
            </div>
            <div className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Data Baru
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-8 pt-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📈 Overview
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'download'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📥 Download
          </button>
          {isMultiSheet && (
            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'sheets'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📊 Per Sheet
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border transition-colors duration-300 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Total Data
                    </h3>
                    <p className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {totalAll.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className={`h-8 w-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-colors duration-300 ${
                totalNew > 0
                  ? (darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200')
                  : (darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200')
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      totalNew > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-800')
                        : (darkMode ? 'text-yellow-400' : 'text-yellow-800')
                    }`}>
                      Data Baru
                    </h3>
                    <p className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                      totalNew > 0
                        ? (darkMode ? 'text-green-400' : 'text-green-600')
                        : (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                    }`}>
                      {totalNew.toLocaleString()}
                    </p>
                  </div>
                  {totalNew > 0 ? (
                    <CheckCircle className={`h-8 w-8 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  ) : (
                    <AlertTriangle className={`h-8 w-8 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                  )}
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-colors duration-300 ${
                darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-purple-400' : 'text-purple-800'
                    }`}>
                      Persentase Baru
                    </h3>
                    <p className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {totalAll > 0 ? ((totalNew / totalAll) * 100).toFixed(1) : '0'}%
                    </p>
                  </div>
                  <FileSpreadsheet className={`h-8 w-8 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
              </div>
            </div>

            {/* Processing Summary */}
            <div className={`p-6 rounded-xl border transition-colors duration-300 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📋 Ringkasan Pemrosesan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Mode Pemrosesan
                  </p>
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isMultiSheet ? '🔄 Multi-Sheet (Python Style)' : '📊 Single Sheet'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Waktu Pemrosesan
                  </p>
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ⏱️ {result.processingTime}s
                  </p>
                </div>
                {isMultiSheet && (
                  <div className="md:col-span-2">
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Sheet yang Diproses
                    </p>
                    <p className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      📊 {result.processedSheets?.join(', ') || 'Tidak ada'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download Tab */}
        {activeTab === 'download' && (
          <div className="space-y-6">
            {isMultiSheet ? (
              // Multi-sheet download options
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    📥 Download Laporan Multi-Sheet
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    File akan berisi summary, data baru per sheet, dan laporan gabungan (seperti script Python)
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onDownload(result, getFileName('multisheet'), true)}
                    disabled={totalNew === 0}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center ${
                      totalNew > 0
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                        : darkMode
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Download className="h-6 w-6 mr-3" />
                    Download Laporan Lengkap
                  </button>
                </div>

                {totalNew === 0 && (
                  <div className={`text-center p-4 rounded-xl ${
                    darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'
                  }`}>
                    <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <p className="font-medium">Tidak ada data baru untuk didownload</p>
                    <p className="text-sm mt-1">Semua IDPEL sudah ada dalam data lama</p>
                  </div>
                )}
              </div>
            ) : (
              // Single sheet download options
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-6 rounded-xl border transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      darkMode ? 'bg-green-800' : 'bg-green-100'
                    }`}>
                      <span className="text-xl">🟢</span>
                    </div>
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Data dengan Highlight
                    </h3>
                  </div>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Semua data dengan highlighting hijau untuk IDPEL baru dan sorting otomatis
                  </p>
                  <button
                    onClick={() => onDownload(result.allData || result, getFileName('highlighted'), true)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      darkMode
                        ? 'bg-green-700 text-green-100 hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Download dengan Highlight
                  </button>
                </div>

                <div className={`p-6 rounded-xl border transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      darkMode ? 'bg-blue-800' : 'bg-blue-100'
                    }`}>
                      <span className="text-xl">🆕</span>
                    </div>
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Data Baru Saja
                    </h3>
                  </div>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Hanya IDPEL yang baru ditemukan dengan highlighting hijau terang
                  </p>
                  <button
                    onClick={() => onDownload(result.newData || [], getFileName('new_only'), true)}
                    disabled={totalNew === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      totalNew > 0
                        ? (darkMode
                            ? 'bg-blue-700 text-blue-100 hover:bg-blue-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700')
                        : (darkMode
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                    }`}
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    {totalNew > 0 ? 'Download Data Baru' : 'Tidak Ada Data Baru'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Per Sheet Tab (Multi-sheet only) */}
        {activeTab === 'sheets' && isMultiSheet && (
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              📊 Detail Per Sheet
            </h3>
            {result.processedSheets?.map(sheetName => {
              const sheetData = result.sheetResults[sheetName];
              const percentage = sheetData.totalAll > 0 ? ((sheetData.totalNew / sheetData.totalAll) * 100).toFixed(1) : '0';
              
              return (
                <div key={sheetName} className={`p-4 rounded-xl border transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        📋 Sheet {sheetName}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total: {sheetData.totalAll.toLocaleString()} data • 
                        Baru: {sheetData.totalNew.toLocaleString()} data ({percentage}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        sheetData.totalNew > 0 
                          ? (darkMode ? 'text-green-400' : 'text-green-600')
                          : (darkMode ? 'text-gray-400' : 'text-gray-600')
                      }`}>
                        {sheetData.totalNew > 0 ? `+${sheetData.totalNew.toLocaleString()}` : 'Tidak ada'}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        data baru
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;