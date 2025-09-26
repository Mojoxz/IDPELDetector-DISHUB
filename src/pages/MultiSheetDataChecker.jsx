import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Zap, FileSpreadsheet } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import FileUploadCard from '../components/FileUploadCard';
import MultiSheetResultsSection from '../components/MultiSheetResultsSection';
import { 
  readExcelFileAllSheets,
  processDataComparisonMultiSheet,
  downloadExcelMultiSheet,
  saveToHistory 
} from '../utils/dataProcessor';

const MultiSheetDataChecker = () => {
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

    if (fileErrors.old || fileErrors.new) {
      setError('Silakan perbaiki error pada file terlebih dahulu');
      return;
    }

    setProcessing(true);
    setError(null);
    
    const startTime = Date.now();

    try {
      console.log('📁 Membaca file lama (multi-sheet)...');
      const dataOld = await readExcelFileAllSheets(files.old, 'old', setUploadProgress);
      
      console.log('📁 Membaca file baru (multi-sheet)...');
      const dataNew = await readExcelFileAllSheets(files.new, 'new', setUploadProgress);

      // Validate data structure
      const targetSheets = ["DMP", "DKP", "NGL", "RKT", "GDN"];
      const hasValidSheets = targetSheets.some(sheet => 
        (dataOld[sheet] && dataOld[sheet].length > 0) || 
        (dataNew[sheet] && dataNew[sheet].length > 0)
      );

      if (!hasValidSheets) {
        throw new Error(`File tidak memiliki sheet yang valid. Sheet yang diperlukan: ${targetSheets.join(', ')}`);
      }

      console.log('🔍 Memproses perbandingan data multi-sheet...');
      
      // Process data comparison for multiple sheets
      const comparisonResult = processDataComparisonMultiSheet(dataOld, dataNew);
      
      const endTime = Date.now();
      const processingTime = ((endTime - startTime) / 1000).toFixed(2);

      const finalResult = {
        ...comparisonResult,
        processingTime: processingTime,
        mode: 'multisheet'
      };

      setResult(finalResult);

      // Save to processing history
      saveToHistory(files.old.name, files.new.name, finalResult);

      console.log('✅ Proses multi-sheet selesai!', {
        totalSheets: finalResult.processedSheets.length,
        totalNewData: finalResult.totalNewAll,
        processingTime: processingTime + 's'
      });

    } catch (err) {
      console.error('❌ Error during multi-sheet processing:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses file multi-sheet');
      
      if (err.message.includes('File lama')) {
        setFileErrors(prev => ({ ...prev, old: 'File tidak dapat dibaca atau tidak memiliki sheet yang valid' }));
      }
      if (err.message.includes('File baru')) {
        setFileErrors(prev => ({ ...prev, new: 'File tidak dapat dibaca atau tidak memiliki sheet yang valid' }));
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (data, filename, useHighlight = true) => {
    try {
      // For multi-sheet results, use the specialized multi-sheet download
      await downloadExcelMultiSheet(result, filename);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Could add fallback download here
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
            <FileSpreadsheet className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Multi-Sheet Data Checker
          </h1>
          <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Analisis multi-sheet IDPEL dengan format seperti script Python (DMP, DKP, NGL, RKT, GDN)
          </p>
        </div>

        {/* File Upload Section */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <FileUploadCard
              id="file-old"
              title="File Agustus (Multi-Sheet)"
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
              title="File September (Multi-Sheet)"
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
              📋 Status File (Multi-Sheet)
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
                  File Agustus: {fileErrors.old ? 'Error' : files.old ? files.old.name : 'Belum dipilih'}
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
                  File September: {fileErrors.new ? 'Error' : files.new ? files.new.name : 'Belum dipilih'}
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
                  Memproses Data Multi-Sheet...
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 mr-3" />
                  Analisis Data Multi-Sheet
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
                  Sedang Memproses Multi-Sheet...
                </h3>
              </div>
              <div className={`space-y-2 text-center transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>🔄 Membaca file Excel...</p>
                <p>📊 Memproses sheet: DMP, DKP, NGL, RKT, GDN...</p>
                <p>🔍 Mencari IDPEL baru per sheet...</p>
                <p>📋 Membuat laporan multi-sheet...</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <MultiSheetResultsSection 
              result={result} 
              onDownload={handleDownload} 
              darkMode={darkMode} 
            />
            
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
              ✨ Fitur Multi-Sheet Processing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Multi-Sheet Processing</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Proses multiple sheet (DMP, DKP, NGL, RKT, GDN) seperti script Python
                </p>
              </div>
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Laporan Per Sheet</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Summary detail untuk setiap sheet dengan statistik lengkap
                </p>
              </div>
              <div className="text-center p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  darkMode ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <span className="text-2xl">🆕</span>
                </div>
                <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Data Baru Saja</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Export khusus data IDPEL baru per sheet dan gabungan semua
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSheetDataChecker;