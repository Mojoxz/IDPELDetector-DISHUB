import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, CheckCircle, Loader2, BarChart3, AlertCircle, FileText } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import StatsCard from '../components/StatsCard';
import TrendChart from '../components/TrendChart';
import PieChart from '../components/PieChart';
import ActivityFeed from '../components/ActivityFeed';
import ProcessingHistory from '../components/ProcessingHistory';
import { getProcessingHistory } from '../utils/dataProcessor';

const AnalyticsPage = () => {
  const { darkMode } = useDarkMode();
  
  const [stats, setStats] = useState({
    totalProcessed: 15420,
    newDataDetected: 3247,
    efficiency: 98.5,
    avgProcessingTime: 2.3
  });

  const [processingHistory, setProcessingHistory] = useState([]);

  useEffect(() => {
    // Load processing history when component mounts
    const history = getProcessingHistory();
    setProcessingHistory(history);

    // Update stats based on real history
    if (history.length > 0) {
      const totalProcessed = history.reduce((sum, item) => sum + item.totalProcessed, 0);
      const totalNewData = history.reduce((sum, item) => sum + item.newDataFound, 0);
      const avgTime = history.reduce((sum, item) => sum + item.processingTime, 0) / history.length;

      setStats(prev => ({
        ...prev,
        totalProcessed: totalProcessed || prev.totalProcessed,
        newDataDetected: totalNewData || prev.newDataDetected,
        avgProcessingTime: avgTime ? parseFloat(avgTime.toFixed(2)) : prev.avgProcessingTime
      }));
    }
  }, []);

  const chartData = [
    { month: 'Jan', oldData: 1200, newData: 300 },
    { month: 'Feb', oldData: 1400, newData: 450 },
    { month: 'Mar', oldData: 1100, newData: 200 },
    { month: 'Apr', oldData: 1600, newData: 600 },
    { month: 'May', oldData: 1300, newData: 350 },
    { month: 'Jun', oldData: 1800, newData: 720 }
  ];

  const pieData = [
    { name: 'Data Baru', value: 35, color: '#10B981' },
    { name: 'Data Lama', value: 65, color: '#6B7280' }
  ];

  const activityData = processingHistory.slice(0, 4).map(item => ({
    action: `${item.newDataFound} data baru terdeteksi`,
    file: item.fileNew,
    count: item.totalProcessed,
    time: new Date(item.timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
    color: item.newDataFound > 0 ? 'green' : 'blue'
  }));

  const statsCardsConfig = [
    {
      title: "Total Data Diproses",
      value: stats.totalProcessed.toLocaleString(),
      icon: Database,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: darkMode ? "bg-blue-900" : "bg-blue-100",
      progressColor: "bg-blue-500",
      progressWidth: "w-full",
      darkMode
    },
    {
      title: "Data Baru Terdeteksi",
      value: stats.newDataDetected.toLocaleString(),
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      bgColor: darkMode ? "bg-green-900" : "bg-green-100",
      progressColor: "bg-green-500",
      progressWidth: "w-3/4",
      darkMode
    },
    {
      title: "Tingkat Akurasi",
      value: `${stats.efficiency}%`,
      icon: CheckCircle,
      gradient: "from-purple-500 to-pink-500",
      bgColor: darkMode ? "bg-purple-900" : "bg-purple-100",
      progressColor: "bg-purple-500",
      progressWidth: "w-full",
      darkMode
    },
    {
      title: "Waktu Rata-rata",
      value: `${stats.avgProcessingTime}s`,
      icon: Loader2,
      gradient: "from-orange-500 to-red-500",
      bgColor: darkMode ? "bg-orange-900" : "bg-orange-100",
      progressColor: "bg-orange-500",
      progressWidth: "w-1/2",
      darkMode
    }
  ];

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900' 
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100'
    }`}>
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analytics Dashboard
          </h1>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Insight mendalam tentang performa dan statistik penggunaan Data Checker IDPEL
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCardsConfig.map((config, index) => (
            <StatsCard key={index} {...config} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={`rounded-2xl shadow-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <TrendChart data={chartData} darkMode={darkMode} />
          </div>
          <div className={`rounded-2xl shadow-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <PieChart data={pieData} darkMode={darkMode} />
          </div>
        </div>

        {/* Processing History & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={`rounded-2xl shadow-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <ProcessingHistory history={processingHistory} darkMode={darkMode} />
          </div>
          <div className={`rounded-2xl shadow-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <ActivityFeed activities={activityData} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;