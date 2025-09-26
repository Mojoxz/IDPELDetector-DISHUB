import React, { useState } from 'react';
import { ChevronDown, FileSpreadsheet, Zap } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ currentPage, setCurrentPage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { darkMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { 
      id: 'checker', 
      label: 'Data Checker', 
      icon: '🔍',
      hasDropdown: true,
      subItems: [
        { 
          id: 'checker', 
          label: 'Single Sheet', 
          icon: <Zap className="h-4 w-4" />,
          description: 'Analisis single sheet dengan highlight'
        },
        { 
          id: 'multisheet', 
          label: 'Multi Sheet', 
          icon: <FileSpreadsheet className="h-4 w-4" />,
          description: 'Analisis multi-sheet (DMP, DKP, NGL, RKT, GDN)'
        }
      ]
    },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  const handleDropdownClick = (e, item) => {
    e.stopPropagation();
    if (item.hasDropdown) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setCurrentPage(item.id);
      setDropdownOpen(false);
    }
  };

  const handleSubItemClick = (subItemId) => {
    setCurrentPage(subItemId);
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isCheckerActive = currentPage === 'checker' || currentPage === 'multisheet';

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
                src="DISHUB SURABAYA.svg" 
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
              <div key={item.id} className="relative">
                <button
                  onClick={(e) => handleDropdownClick(e, item)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                    item.hasDropdown ? 
                      (isCheckerActive
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      ) :
                      (currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      )
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {/* Desktop Dropdown */}
                {item.hasDropdown && dropdownOpen && (
                  <div className={`absolute top-full left-0 mt-1 w-80 rounded-xl shadow-lg border z-50 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-2">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                            currentPage === subItem.id
                              ? 'bg-blue-600 text-white'
                              : darkMode
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${
                              currentPage === subItem.id
                                ? 'bg-blue-500'
                                : darkMode
                                  ? 'bg-gray-700 group-hover:bg-gray-600'
                                  : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              {subItem.icon}
                            </div>
                            <div>
                              <div className="font-medium">{subItem.label}</div>
                              <div className={`text-sm transition-colors duration-200 ${
                                currentPage === subItem.id
                                  ? 'text-blue-100'
                                  : darkMode
                                    ? 'text-gray-400 group-hover:text-gray-300'
                                    : 'text-gray-500 group-hover:text-gray-600'
                              }`}>
                                {subItem.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              <div key={item.id} className="mb-2">
                {!item.hasDropdown ? (
                  <button
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
                    } rounded-lg`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <div>
                    <div className={`px-4 py-2 font-semibold text-sm uppercase tracking-wider ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </div>
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubItemClick(subItem.id)}
                        className={`w-full text-left px-6 py-3 ml-4 font-medium transition-all duration-300 ${
                          currentPage === subItem.id
                            ? 'bg-blue-600 text-white'
                            : darkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        } rounded-lg mb-1`}
                      >
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded mr-3 ${
                            currentPage === subItem.id
                              ? 'bg-blue-500'
                              : darkMode
                                ? 'bg-gray-700'
                                : 'bg-gray-200'
                          }`}>
                            {subItem.icon}
                          </div>
                          <div>
                            <div className="font-medium">{subItem.label}</div>
                            <div className={`text-xs ${
                              currentPage === subItem.id
                                ? 'text-blue-100'
                                : darkMode
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                            }`}>
                              {subItem.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside handler for dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;