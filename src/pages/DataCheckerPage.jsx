import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, Loader2, BarChart3, Sparkles } from 'lucide-react';
import FileUploadCard from '../components/FileUploadCard';
import ResultsSection from '../components/ResultsSection';
import { 
  readExcelFile, 
  processDataComparison, 
  downloadExcel, 
  downloadExcelSeparateSheets,
  downloadExcelWithHighlight,
  saveToHistory 
} from '../utils/dataProcessor';

const DataCheckerPage = () => {
  const [fileOld, setFileOld] = useState(null);
  const [fileNew, setFileNew] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ old: 0, new: 0 });

  const processData = async () => {
    if (!fileOld || !fileNew) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      const dataOld = await readExcelFile(fileOld, 'old', setUploadProgress);
      const dataNew = await readExcelFile(fileNew, 'new', setUploadProgress);

      if (!dataOld[0]?.hasOwnProperty('IDPEL') || !dataNew[0]?.hasOwnProperty('IDPEL')) {
        throw new Error("Kolom 'IDPEL' tidak ditemukan di salah satu file.");
      }

      const processedResult = processDataComparison(dataOld, dataNew);
      
      // Calculate processing time
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
      
      // Save to history
      const historyItem = saveToHistory(fileOld.name, fileNew.name, {
        ...processedResult,
        processingTime: parseFloat(processingTime)
      });

      // Add processing info to result
      const resultWithMeta = {
        ...processedResult,
        processingTime,
        historyId: historyItem.id
      };

      setResult(resultWithMeta);

    } catch (error) {
      alert(`Gagal memproses data: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'old') {
        setFileOld(file);
      } else {
        setFileNew(file);
      }
      setResult(null);
      setUploadProgress({ old: 0, new: 0 });
    }
  };

  const handleDownload = (data, filename, highlightNew = false) => {
    downloadExcel(data, filename, highlightNew);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Checker IDPEL
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload file Excel lama dan baru untuk mendeteksi data baru berdasarkan IDPEL dengan visualisasi yang menarik
          </p>
        </div>

        {/* File Upload Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <FileUploadCard
            title="File Data Lama"
            file={fileOld}
            onFileSelect={(e) => handleFileSelect(e, 'old')}
            uploadProgress={uploadProgress.old}
            color="blue"
            id="file-old"
          />
          <FileUploadCard
            title="File Data Baru"
            file={fileNew}
            onFileSelect={(e) => handleFileSelect(e, 'new')}
            uploadProgress={uploadProgress.new}
            color="purple"
            id="file-new"
          />
        </div>

        {/* Process Button */}
        <div className="text-center mb-12">
          <button
            onClick={processData}
            disabled={!fileOld || !fileNew || isProcessing}
            className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
              !fileOld || !fileNew || isProcessing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="inline h-6 w-6 mr-3 animate-spin" />
                Memproses Data...
              </>
            ) : (
              <>
                <BarChart3 className="inline h-6 w-6 mr-3" />
                Proses & Analisis Data
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <ResultsSection
            result={result}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};


export default DataCheckerPage;