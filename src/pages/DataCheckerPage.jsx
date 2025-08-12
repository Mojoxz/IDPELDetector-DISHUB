import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import FileUploadCard from '../components/FileUploadCard';
import ResultsSection from '../components/ResultsSection';
import { 
  readExcelFile, 
  processDataComparison, 
  downloadExcel, 
  downloadExcelWithGreenHighlight,
  saveToHistory 
} from '../utils/dataProcessor';

const DataChecker = () => {
  const [files, setFiles] = useState({ old: null, new: null });
  const [uploadProgress, setUploadProgress] = useState({ old: 0, new: 0 });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (type) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      setError(null); // Clear any previous errors
    }
  };

  const handleProcess = async () => {
    if (!files.old || !files.new) {
      setError('Silakan pilih kedua file Excel terlebih dahulu');
      return;
    }

    setProcessing(true);
    setError(null);
    
    const startTime = Date.now();

    try {
      // Read both Excel files
      console.log('📁 Membaca file lama...');
      const dataOld = await readExcelFile(files.old, 'old', setUploadProgress);
      
      console.log('📁 Membaca file baru...');
      const dataNew = await readExcelFile(files.new, 'new', setUploadProgress);

      // Validate data structure
      if (!dataOld || dataOld.length === 0) {
        throw new Error('File lama kosong atau tidak valid');
      }
      if (!dataNew || dataNew.length === 0) {
        throw new Error('File baru kosong atau tidak valid');
      }

      // Check if IDPEL column exists
      const hasIdpelOld = dataOld.some(row => row.IDPEL !== undefined);
      const hasIdpelNew = dataNew.some(row => row.IDPEL !== undefined);

      if (!hasIdpelOld || !hasIdpelNew) {
        throw new Error('Kolom IDPEL tidak ditemukan dalam salah satu file. Pastikan file Excel memiliki kolom IDPEL.');
      }

      console.log('🔍 Memproses perbandingan data...');
      
      // Process data comparison with automatic sorting
      const comparisonResult = processDataComparison(dataOld, dataNew);
      
      const endTime = Date.now();
      const processingTime = ((endTime - startTime) / 1000).toFixed(2);

      const finalResult = {
        ...comparisonResult,
        processingTime: processingTime
      };

      setResult(finalResult);

      // Save to processing history
      saveToHistory(files.old.name, files.new.name, finalResult);

      console.log('✅ Proses selesai!', {
        totalData: finalResult.totalAll,
        newData: finalResult.totalNew,
        processingTime: processingTime + 's'
      });

    } catch (err) {
      console.error('❌ Error during processing:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses file');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (data, filename, useHighlight = true) => {
    try {
      if (useHighlight) {
        // Use enhanced highlighting function
        await downloadExcelWithGreenHighlight(data, filename);
      } else {
        // Use basic download function
        downloadExcel(data, filename, false);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to basic download
      downloadExcel(data, filename, false);
    }
  };

  const resetAll = () => {
    setFiles({ old: null, new: null });
    setUploadProgress({ old: 0, new: 0 });
    setResult(null);
    setError(null);
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Checker IDPEL Enhanced
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis perbandingan data IDPEL dengan highlight otomatis dan pengurutan data baru
          </p>
        </div>

        {/* File Upload Section */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <FileUploadCard
              id="file-old"
              title="Data Lama"
              file={files.old}
              onFileSelect={handleFileSelect('old')}
              uploadProgress={uploadProgress.old}
              color="blue"
            />
            <FileUploadCard
              id="file-new"
              title="Data Baru"
              file={files.new}
              onFileSelect={handleFileSelect('new')}
              uploadProgress={uploadProgress.new}
              color="purple"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Process Button */}
        {!result && (
          <div className="text-center mb-12">
            <button
              onClick={handleProcess}
              disabled={!files.old || !files.new || processing}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center mx-auto ${
                files.old && files.new && !processing
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Memproses Data...
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 mr-3" />
                  Analisis Data dengan Highlight
                </>
              )}
            </button>
          </div>
        )}

        {/* Processing Info */}
        {processing && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Sedang Memproses...
                </h3>
              </div>
              <div className="space-y-2 text-center text-gray-600">
                <p>🔄 Membaca file Excel...</p>
                <p>🔍 Menganalisis data IDPEL...</p>
                <p>⚡ Menyiapkan highlight otomatis...</p>
                <p>📊 Mengurutkan data baru ke atas...</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <ResultsSection result={result} onDownload={handleDownload} />
            
            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetAll}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium"
              >
                🔄 Analisis Data Baru
              </button>
            </div>
          </div>
        )}

        {/* Features Info */}
        {!result && (
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ✨ Fitur Enhanced
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🟢</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Highlight Otomatis</h4>
                <p className="text-sm text-gray-600">
                  Data IDPEL baru otomatis ter-highlight dengan warna hijau terang
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">⬆️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Auto-Sort</h4>
                <p className="text-sm text-gray-600">
                  IDPEL baru otomatis diurutkan ke bagian atas untuk kemudahan review
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Multi-Format</h4>
                <p className="text-sm text-gray-600">
                  Berbagai opsi download: dengan status, multi-sheet, dan data baru saja
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataChecker;