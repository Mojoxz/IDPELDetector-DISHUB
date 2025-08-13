import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';


const Navbar = ({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { darkMode } = useDarkMode();
  
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'checker', label: 'Data Checker', icon: '🔍' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/95 backdrop-blur-sm border-gray-800' 
        : 'bg-white/95 backdrop-blur-sm border-gray-200'
    } border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-white p-1'>
              <img 
                src="public/logo.svg" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              IDPEL Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <DarkModeToggle className="ml-4" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-4 h-0.5 transition-all duration-300 ${
                  darkMode ? 'bg-gray-300' : 'bg-gray-600'
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`w-4 h-0.5 my-1 transition-all duration-300 ${
                  darkMode ? 'bg-gray-300' : 'bg-gray-600'
                } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-4 h-0.5 transition-all duration-300 ${
                  darkMode ? 'bg-gray-300' : 'bg-gray-600'
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } rounded-lg mb-1`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;