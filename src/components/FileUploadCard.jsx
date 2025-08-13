import React from 'react';
import { Upload, File, Check, X, RotateCcw } from 'lucide-react';

const FileUploadCard = ({ id, title, file, onFileSelect, onFileRemove, uploadProgress, color, darkMode, error }) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      border: darkMode ? 'border-blue-500' : 'border-blue-300',
      bg: darkMode ? 'bg-blue-900' : 'bg-blue-50',
      text: darkMode ? 'text-blue-300' : 'text-blue-600'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      border: darkMode ? 'border-purple-500' : 'border-purple-300',
      bg: darkMode ? 'bg-purple-900' : 'bg-purple-50',
      text: darkMode ? 'text-purple-300' : 'text-purple-600'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  const handleFileRemove = () => {
    if (onFileRemove) {
      onFileRemove();
    }
  };

  return (
    <div className={`rounded-2xl p-8 shadow-lg border-2 border-dashed transition-all duration-300 hover:shadow-xl ${
      error 
        ? darkMode 
          ? 'border-red-500 bg-red-900/30' 
          : 'border-red-300 bg-red-50'
        : file 
          ? `${currentColor.border} ${currentColor.bg}` 
          : darkMode 
            ? 'border-gray-600 bg-gray-800 hover:border-gray-500' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
    }`}>
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
          error
            ? darkMode 
              ? 'bg-red-900' 
              : 'bg-red-100'
            : file 
              ? `bg-gradient-to-r ${currentColor.gradient}` 
              : darkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-200'
        }`}>
          {error ? (
            <X className={`h-8 w-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          ) : file ? (
            <Check className="h-8 w-8 text-white" />
          ) : (
            <Upload className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${
          error
            ? darkMode ? 'text-red-400' : 'text-red-600'
            : file 
              ? currentColor.text 
              : darkMode 
                ? 'text-gray-300' 
                : 'text-gray-700'
        }`}>
          {title}
        </h3>
        
        {error ? (
          <div className="space-y-3">
            <p className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              ❌ Error saat memuat file
            </p>
            <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input
                type="file"
                id={`${id}-retry`}
                accept=".xlsx,.xls"
                onChange={onFileSelect}
                className="hidden"
              />
              <label
                htmlFor={`${id}-retry`}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                  darkMode
                    ? 'bg-blue-700 text-blue-200 hover:bg-blue-600 border border-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
                }`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Pilih Ulang
              </label>
              <button
                onClick={handleFileRemove}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        ) : file ? (
          <div className="space-y-2">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {file.name}
            </p>
            <p className={`text-xs ${currentColor.text}`}>
              ✅ File berhasil dipilih
            </p>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className={`w-full rounded-full h-2 mt-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${currentColor.gradient} transition-all duration-300`}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            {/* File Actions */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
              <input
                type="file"
                id={`${id}-change`}
                accept=".xlsx,.xls"
                onChange={onFileSelect}
                className="hidden"
              />
              <label
                htmlFor={`${id}-change`}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Ganti File
              </label>
              <button
                onClick={handleFileRemove}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  darkMode
                    ? 'bg-red-800 text-red-200 hover:bg-red-700 border border-red-700'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                <X className="h-3 w-3 mr-1" />
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pilih file Excel (.xlsx, .xls)
            </p>
            <input
              type="file"
              id={id}
              accept=".xlsx,.xls"
              onChange={onFileSelect}
              className="hidden"
            />
            <label
              htmlFor={id}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <File className="h-4 w-4 mr-2" />
              Browse File
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadCard;