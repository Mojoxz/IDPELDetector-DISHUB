import React from 'react';
import { Upload, Database, TrendingUp, Shield, Sparkles, Info } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const HomePage = ({ setCurrentPage }) => {
  const { darkMode } = useDarkMode();
  
  const features = [
    {
      icon: Database,
      title: "Smart Data Detection",
      description: "Deteksi otomatis data baru berdasarkan IDPEL dengan algoritma canggih",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Visualisasi data yang interaktif dan insight mendalam",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Secure Processing",
      description: "Pemrosesan data dilakukan secara lokal di browser Anda",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Modern Interface",
      description: "Antarmuka yang responsif dan mudah digunakan di semua perangkat",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Teknologi Terdepan untuk Analisis Data
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Pendeteksi Data Baru
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IDPEL Pro
              </span>
            </h1>
            
            <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Analisis dan deteksi data baru dengan mudah menggunakan teknologi web modern. 
              Upload file Excel, dapatkan insight, dan download hasil dalam hitungan detik.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('checker')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <Database className="h-5 w-5 mr-2" />
                Mulai Analisis Data
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className={`px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border flex items-center justify-center ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Info className="h-5 w-5 mr-2" />
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Fitur Unggulan
          </h2>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Dilengkapi dengan teknologi terdepan untuk memberikan pengalaman terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className={`rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-100'
                }`}>
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap untuk Menganalisis Data Anda?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Mulai sekarang dan rasakan kemudahan deteksi data baru dengan IDPEL Pro
          </p>
          <button
            onClick={() => setCurrentPage('checker')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload File Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;