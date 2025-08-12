import React from 'react';
import { Download, FileText, CheckCircle, Sparkles, BarChart3, FileSpreadsheet } from 'lucide-react';

const ResultsSection = ({ result, onDownload }) => {
  const { allData, newData, totalNew, totalAll, processingTime } = result;

  // Import the alternative download methods
  const downloadWithSeparateSheets = (data, filename) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
      const wb = window.XLSX.utils.book_new();
      
      // Sheet 1: Semua data
      const allDataClean = data.map(row => {
        const { _IS_NEW_, ...cleanRow } = row;
        return cleanRow;
      });
      const wsAll = window.XLSX.utils.json_to_sheet(allDataClean);
      window.XLSX.utils.book_append_sheet(wb, wsAll, "Semua Data");
      
      // Sheet 2: Data baru saja
      const newDataClean = data.filter(row => row._IS_NEW_).map(row => {
        const { _IS_NEW_, ...cleanRow } = row;
        return cleanRow;
      });
      
      if (newDataClean.length > 0) {
        const wsNew = window.XLSX.utils.json_to_sheet(newDataClean);
        window.XLSX.utils.book_append_sheet(wb, wsNew, "Data Baru");
      }
      
      // Sheet 3: Summary
      const summary = [
        { Keterangan: 'Total Data', Jumlah: data.length },
        { Keterangan: 'Data Baru', Jumlah: newDataClean.length },
        { Keterangan: 'Data Lama', Jumlah: data.length - newDataClean.length },
        { Keterangan: 'Persentase Data Baru', Jumlah: `${((newDataClean.length / data.length) * 100).toFixed(2)}%` }
      ];
      const wsSummary = window.XLSX.utils.json_to_sheet(summary);
      window.XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      window.XLSX.writeFile(wb, filename);
    };
    document.head.appendChild(script);
  };

  const downloadWithIndicatorColumn = (data, filename) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
      // Tambahkan kolom indikator untuk data baru
      const exportData = data.map(row => {
        const { _IS_NEW_, ...cleanRow } = row;
        return {
          'STATUS_DATA': _IS_NEW_ ? '★ BARU ★' : 'LAMA',
          ...cleanRow
        };
      });

      const wb = window.XLSX.utils.book_new();
      const ws = window.XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [];
      if (exportData.length > 0) {
        Object.keys(exportData[0]).forEach((key, index) => {
          let maxWidth = key.length;
          exportData.forEach(row => {
            const cellValue = String(row[key] || '');
            if (cellValue.length > maxWidth) {
              maxWidth = Math.min(cellValue.length, 50);
            }
          });
          colWidths.push({ wch: maxWidth + 2 });
        });
      }
      ws['!cols'] = colWidths;

      window.XLSX.utils.book_append_sheet(wb, ws, "Data");
      window.XLSX.writeFile(wb, filename);
    };
    document.head.appendChild(script);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Data</p>
              <p className="text-3xl font-bold text-gray-900">{totalAll.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Baru</p>
              <p className="text-3xl font-bold text-emerald-600">{totalNew.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waktu Proses</p>
              <p className="text-3xl font-bold text-purple-600">{processingTime}s</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Persentase Data Baru</h3>
          <span className="text-lg font-bold text-emerald-600">
            {((totalNew / totalAll) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(totalNew / totalAll) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {totalNew} dari {totalAll} data adalah data baru
        </p>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Download className="mr-3 h-6 w-6 text-blue-600" />
          Download Hasil Analisis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Semua data dengan kolom indikator */}
          <button
            onClick={() => downloadWithIndicatorColumn(allData, 'data-dengan-status.xlsx')}
            className="flex flex-col items-center p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          >
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Data dengan Status</h4>
            <p className="text-sm text-gray-600 text-center">
              Semua data dengan kolom status (BARU/LAMA)
            </p>
            <span className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {totalAll} records
            </span>
          </button>

          {/* Option 2: Sheet terpisah */}
          <button
            onClick={() => downloadWithSeparateSheets(allData, 'data-terpisah-sheets.xlsx')}
            className="flex flex-col items-center p-6 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
          >
            <FileText className="h-12 w-12 text-purple-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Sheet Terpisah</h4>
            <p className="text-sm text-gray-600 text-center">
              3 sheet: Semua data, Data baru, Summary
            </p>
            <span className="mt-3 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Multi-sheet
            </span>
          </button>

          {/* Option 3: Data baru saja */}
          <button
            onClick={() => onDownload(newData, 'data-baru-saja.xlsx', false)}
            disabled={totalNew === 0}
            className={`flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-200 ${
              totalNew === 0 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className={`h-12 w-12 mb-3 ${totalNew === 0 ? 'text-gray-400' : 'text-emerald-600'}`} />
            <h4 className={`font-semibold mb-2 ${totalNew === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
              Data Baru Saja
            </h4>
            <p className={`text-sm text-center ${totalNew === 0 ? 'text-gray-400' : 'text-gray-600'}`}>
              Hanya data yang terdeteksi baru
            </p>
            <span className={`mt-3 px-3 py-1 text-xs rounded-full ${
              totalNew === 0 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {totalNew} records
            </span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-emerald-900">Analisis Selesai!</h4>
            <p className="text-emerald-700">
              Berhasil memproses {totalAll.toLocaleString()} data dan menemukan {totalNew.toLocaleString()} data baru dalam {processingTime} detik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;