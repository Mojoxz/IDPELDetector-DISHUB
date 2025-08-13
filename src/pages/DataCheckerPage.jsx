import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
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
  const { darkMode } = useDarkMode();
  
  const [files, setFiles] = useState({ old: null, new: null });
  const [uploadProgress, setUploadProgress] = useState({ old: 0, new: 0 });
  const [fileErrors, setFileErrors] = useState({ old: null, new: null });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (!validTypes.includes(file.type)) {
      return 'File harus berformat Excel (.xlsx atau .xls)';
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'Ukuran file tidak boleh lebih dari 10MB';
    }
    
    return null;
  };

  const handleFileSelect = (type) => (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous errors
    setFileErrors(prev => ({ ...prev, [type]: null }));
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileErrors(prev => ({ ...prev, [type]: validationError }));
      // Clear the input
      event.target.value = '';
      return;
    }

    // Set file and reset progress
    setFiles(prev => ({ ...prev, [type]: file }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    
    // Simulate upload progress for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      setUploadProgress(prev => ({ ...prev, [type]: Math.min(progress, 100) }));
    }, 200);
  };

  const handleFileRemove = (type) => () => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    setFileErrors(prev => ({ ...prev, [type]: null }));
    setError(null);
    
    // Clear any file input values
    const fileInputs = document.querySelectorAll(`input[type="file"]`);
    fileInputs.forEach(input => {
      if (input.id.includes(type)) {
        input.value = '';
      }
    });
  };

  const handleProcess = async () => {
    if (!files.old || !files.new) {
      setError('Silakan pilih kedua file Excel terlebih dahulu');
      return;
    }

    // Check for any file errors
    if (fileErrors.old || fileErrors.new) {
      setError('Silakan perbaiki error pada file terlebih dahulu');
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
      
      // If it's a file reading error, set file error
      if (err.message.includes('File lama')) {
        setFileErrors(prev => ({ ...prev, old: 'File tidak dapat dibaca atau rusak' }));
      }
      if (err.message.includes('File baru')) {
        setFileErrors(prev => ({ ...prev, new: 'File tidak dapat dibaca atau rusak' }));
      }
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
    setFileErrors({ old: null, new: null });
    setResult(null);
    setError(null);
    setProcessing(false);
    
    // Clear all file inputs
    const fileInputs = document.querySelectorAll(`input[type="file"]`);
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Data Checker IDPEL Enhanced
          </h1>
          <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
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
              onFileRemove={handleFileRemove('old')}
              uploadProgress={uploadProgress.old}
              color="blue"
              darkMode={darkMode}
              error={fileErrors.old}
            />
            <FileUploadCard
              id="file-new"
              title="Data Baru"
              file={files.new}
              onFileSelect={handleFileSelect('new')}
              onFileRemove={handleFileRemove('new')}
              uploadProgress={uploadProgress.new}
              color="purple"
              darkMode={darkMode}
              error={fileErrors.new}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-8 p-4 border rounded-xl transition-colors duration-300 ${
            darkMode 
              ? 'bg-red-900 border-red-700' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <AlertCircle className={`h-5 w-5 mr-3 flex-shrink-0 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
              <p className={`font-medium ${
                darkMode ? 'text-red-200' : 'text-red-800'
              }`}>{error}</p>
            </div>
          </div>
        )}

        {/* File Status Summary */}
        {(files.old || files.new || fileErrors.old || fileErrors.new) && !result && (
          <div className={`mb-8 p-4 rounded-xl border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              📋 Status File
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className={`mr-3 ${
                  fileErrors.old ? 
                    (darkMode ? 'text-red-400' : 'text-red-600') :
                    files.old ? 
                      (darkMode ? 'text-green-400' : 'text-green-600') :
                      (darkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {fileErrors.old ? '❌' : files.old ? '✅' : '⏳'}
                </span>
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Data Lama: {fileErrors.old ? 'Error' : files.old ? files.old.name : 'Belum dipilih'}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`mr-3 ${
                  fileErrors.new ? 
                    (darkMode ? 'text-red-400' : 'text-red-600') :
                    files.new ? 
                      (darkMode ? 'text-green-400' : 'text-green-600') :
                      (darkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {fileErrors.new ? '❌' : files.new ? '✅' : '⏳'}
                </span>
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Data Baru: {fileErrors.new ? 'Error' : files.new ? files.new.name : 'Belum dipilih'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        {!result && (
          <div className="text-center mb-12">
            <button
              onClick={handleProcess}
              disabled={!files.old || !files.new || processing || fileErrors.old || fileErrors.new}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center mx-auto ${
                files.old && files.new && !processing && !fileErrors.old && !fileErrors.new
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
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
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Sedang Memproses...
                </h3>
              </div>
              <div className={`space-y-2 text-center transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
            <ResultsSection result={result} onDownload={handleDownload} darkMode={darkMode} />
            
            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetAll}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  darkMode
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                }`}
              >
                🔄 Analisis Data Baru
              </button>
            </div>
          </div>
        )}

        {/* Features Info */}
        {!result && (
          <div className={`mt-16 rounded-2xl p-8 shadow-lg border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ✨ Fitur Enhanced
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <span className="text-2xl">🟢</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Highlight Otomatis</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Data IDPEL baru otomatis ter-highlight dengan warna hijau terang
                </p>
              </div>
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <span className="text-2xl">⬆️</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Auto-Sort</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  IDPEL baru otomatis diurutkan ke bagian atas untuk kemudahan review
                </p>
              </div>
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Multi-Format</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
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