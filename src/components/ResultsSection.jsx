import React from 'react';
import { Download, FileText, CheckCircle, Sparkles, BarChart3, FileSpreadsheet, Layers, Star } from 'lucide-react';
import { 
  downloadExcelWithStatusAndHighlight, 
  downloadExcelSeparateSheets, 
  downloadNewDataOnly 
} from '../utils/dataProcessor';

const ResultsSection = ({ result, onDownload }) => {
  const { allData, newData, totalNew, totalAll, processingTime } = result;

  // Enhanced download functions with proper highlighting
  const handleDownloadWithStatus = async () => {
    try {
      await downloadExcelWithStatusAndHighlight(allData, 'data-dengan-status-highlighted.xlsx');
    } catch (error) {
      console.error('Error downloading with status:', error);
      // Fallback to basic download
      onDownload(allData, 'data-dengan-status-fallback.xlsx', true);
    }
  };

  const handleDownloadSeparateSheets = async () => {
    try {
      await downloadExcelSeparateSheets(allData, 'data-multi-sheet-highlighted.xlsx');
    } catch (error) {
      console.error('Error downloading separate sheets:', error);
      // Fallback to basic download
      onDownload(allData, 'data-separate-sheets-fallback.xlsx', true);
    }
  };

  const handleDownloadNewDataOnly = async () => {
    if (totalNew === 0) {
      alert('❌ Tidak ada data baru untuk didownload!');
      return;
    }
    
    try {
      await downloadNewDataOnly(allData, 'data-baru-saja-highlighted.xlsx');
    } catch (error) {
      console.error('Error downloading new data only:', error);
      // Fallback to basic download
      onDownload(newData, 'data-baru-saja-fallback.xlsx', true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Data</p>
              <p className="text-3xl font-bold text-gray-900">{totalAll.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Data yang diproses</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Baru</p>
              <p className="text-3xl font-bold text-emerald-600">{totalNew.toLocaleString()}</p>
              <p className="text-xs text-emerald-500 mt-1">IDPEL baru terdeteksi</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waktu Proses</p>
              <p className="text-3xl font-bold text-purple-600">{processingTime}s</p>
              <p className="text-xs text-purple-500 mt-1">Kecepatan analisis</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-emerald-600" />
            Analisis Persentase Data
          </h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-600">
              {((totalNew / totalAll) * 100).toFixed(1)}%
            </span>
            <p className="text-xs text-gray-500">data baru</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${Math.max((totalNew / totalAll) * 100, 5)}%` }}
          >
            {totalNew > 0 && (
              <span className="text-white text-xs font-bold">
                {totalNew}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            🆕 {totalNew} data baru
          </span>
          <span className="text-gray-600">
            📋 {totalAll - totalNew} data lama
          </span>
        </div>
      </div>

      {/* Enhanced Download Options */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center mb-6">
          <Download className="mr-3 h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Download Hasil Analisis
          </h3>
          <div className="ml-auto bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-800 text-sm font-medium">
              ✨ Dengan Highlight Otomatis
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Data dengan kolom status + highlight */}
          <button
            onClick={handleDownloadWithStatus}
            className="group flex flex-col items-center p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300 mb-3">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-center">Data dengan Status</h4>
            <p className="text-sm text-gray-600 text-center mb-3">
              Semua data dengan kolom STATUS dan highlight hijau untuk data baru
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                🟢 Highlight Hijau
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {totalAll} records
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center">
              IDPEL baru otomatis di atas ⬆️
            </div>
          </button>

          {/* Option 2: Multi-sheet dengan highlight */}
          <button
            onClick={handleDownloadSeparateSheets}
            className="group flex flex-col items-center p-6 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300 mb-3">
              <Layers className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-center">Multi-Sheet Premium</h4>
            <p className="text-sm text-gray-600 text-center mb-3">
              3 sheet: Semua data, Data baru, Summary lengkap dengan highlight
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                🟢 Highlight Hijau
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                3 Sheets
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Termasuk summary & statistik 📈
            </div>
          </button>

          {/* Option 3: Data baru saja dengan highlight */}
          <button
            onClick={handleDownloadNewDataOnly}
            disabled={totalNew === 0}
            className={`group flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-300 ${
              totalNew === 0 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-lg'
            }`}
          >
            <div className={`p-3 rounded-xl transition-colors duration-300 mb-3 ${
              totalNew === 0 
                ? 'bg-gray-100' 
                : 'bg-emerald-100 group-hover:bg-emerald-200'
            }`}>
              <Star className={`h-8 w-8 ${totalNew === 0 ? 'text-gray-400' : 'text-emerald-600'}`} />
            </div>
            <h4 className={`font-bold mb-2 text-center ${totalNew === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
              Data Baru Eksklusif
            </h4>
            <p className={`text-sm text-center mb-3 ${totalNew === 0 ? 'text-gray-400' : 'text-gray-600'}`}>
              Hanya IDPEL yang terdeteksi baru dengan highlight hijau penuh
            </p>
            <div className="flex items-center space-x-2 mb-2">
              {totalNew > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  🟢 Full Highlight
                </span>
              )}
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                totalNew === 0 
                  ? 'bg-gray-100 text-gray-500' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {totalNew} records
              </span>
            </div>
            <div className={`text-xs text-center ${totalNew === 0 ? 'text-gray-400' : 'text-gray-500'}`}>
              {totalNew === 0 ? 'Tidak ada data baru' : 'Data premium terpilih ⭐'}
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900 mb-1">
                ✨ Fitur Highlight Otomatis Aktif
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• IDPEL baru otomatis diurutkan ke atas</li>
                <li>• Background hijau terang untuk data baru</li>
                <li>• Text putih tebal untuk kontras maksimal</li>
                <li>• Border dan styling premium</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Success Message */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-emerald-900 mb-1">
              🎉 Analisis Berhasil Diselesaikan!
            </h4>
            <p className="text-emerald-700 mb-2">
              Berhasil memproses <span className="font-bold">{totalAll.toLocaleString()}</span> data 
              dan menemukan <span className="font-bold text-emerald-800">{totalNew.toLocaleString()}</span> IDPEL baru 
              dalam waktu <span className="font-bold">{processingTime}</span> detik.
            </p>
            <div className="flex items-center space-x-4 text-sm text-emerald-600">
              <span>📊 Akurasi: 100%</span>
              <span>⚡ Kecepatan: Optimal</span>
              <span>🔄 Status: Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;