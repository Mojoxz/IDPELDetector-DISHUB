import React from 'react';
import { Database, Sparkles, TrendingUp, Shield, Info } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Database,
      title: "Pemrosesan Lokal",
      description: "Semua data diproses langsung di browser Anda untuk keamanan maksimal",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "Interface Modern",
      description: "Desain responsif dan intuitif yang dapat digunakan di semua perangkat",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Analisis Cerdas",
      description: "Algoritma canggih untuk deteksi data baru dengan akurasi tinggi",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Tidak ada data yang dikirim ke server, semua proses dilakukan offline",
      color: "from-orange-500 to-red-500"
    }
  ];

  const technicalSpecs = [
    {
      icon: Database,
      title: "Format Support",
      description: "Excel (.xlsx, .xls), CSV",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Performance",
      description: "Hingga 100K+ records per detik",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Security",
      description: "100% Client-side processing",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const workflowSteps = [
    { step: "1", title: "Upload Files", desc: "Upload file Excel lama dan baru", color: "blue" },
    { step: "2", title: "Auto Analysis", desc: "Sistem otomatis menganalisis perbedaan", color: "purple" },
    { step: "3", title: "Get Results", desc: "Download hasil dengan highlighting data baru", color: "green" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
            <Info className="h-4 w-4 mr-2" />
            Tentang DataChecker Pro
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Solusi Modern untuk
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analisis Data Excel
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            DataChecker Pro adalah aplikasi web canggih yang dirancang khusus untuk membantu Anda 
            mengidentifikasi data baru dalam file Excel dengan mudah dan efisien. Dikembangkan dengan 
            teknologi web modern untuk memberikan pengalaman terbaik.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih DataChecker Pro?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dilengkapi dengan fitur-fitur canggih untuk memenuhi semua kebutuhan analisis data Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Spesifikasi Teknis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technicalSpecs.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`bg-gradient-to-r ${spec.gradient} p-4 rounded-2xl inline-block mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{spec.title}</h4>
                  <p className="text-gray-600">{spec.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Cara Kerja
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className={`w-16 h-16 bg-gradient-to-r ${
                  item.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                  item.color === 'purple' ? 'from-purple-500 to-pink-500' :
                  'from-green-500 to-emerald-500'
                } rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg`}>
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">
            Siap Mencoba DataChecker Pro?
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Mulai analisis data Anda sekarang juga dengan teknologi terdepan
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <p>© 2024 DataChecker Pro. Dibuat dengan ❤️ menggunakan React & Tailwind CSS</p>
            <p>Versi 1.0.0 | Privacy-focused | No data leaves your browser</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;