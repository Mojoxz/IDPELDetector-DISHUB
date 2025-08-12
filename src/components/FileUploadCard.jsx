import React from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const FileUploadCard = ({ 
  title, 
  file, 
  onFileSelect, 
  uploadProgress, 
  color = 'blue',
  id 
}) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-400',
      bg: 'bg-blue-50',
      text: 'text-blue-500',
      hover: 'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      border: 'border-purple-400',
      bg: 'bg-purple-50',
      text: 'text-purple-500',
      hover: 'hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className={`bg-gradient-to-r ${colors.gradient} p-3 rounded-xl mr-4`}>
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center ${colors.hover} transition-all duration-300 group`}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileSelect}
          className="hidden"
          id={id}
        />
        <label htmlFor={id} className="cursor-pointer">
          <div className="group-hover:scale-110 transition-transform duration-300">
            <Upload className={`mx-auto h-16 w-16 text-gray-400 group-hover:${colors.text} mb-4`} />
          </div>
          <p className={`text-lg text-gray-600 mb-2 group-hover:${colors.text}`}>
            {file ? file.name : `Klik untuk pilih file Excel ${title.toLowerCase()}`}
          </p>
          <p className="text-sm text-gray-500">
            Format yang didukung: .xlsx, .xls
          </p>
        </label>
      </div>
      
      {file && (
        <div className="mt-6">
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">File berhasil dipilih</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;