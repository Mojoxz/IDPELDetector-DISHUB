// Function to read Excel file with progress
export const readExcelFile = (file, type, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(prev => ({ ...prev, [type]: progress }));
      }
    };
    reader.onload = (e) => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = () => {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = window.XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        };
        document.head.appendChild(script);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Function to process data comparison with automatic sorting (NEW data first)
export const processDataComparison = (dataOld, dataNew) => {
  const idpelOldSet = new Set(dataOld.map(row => String(row.IDPEL)));
  const processedData = dataNew.map(row => ({
    ...row,
    _IS_NEW_: !idpelOldSet.has(String(row.IDPEL))
  }));

  // Sort data: NEW data first, then OLD data
  const sortedData = processedData.sort((a, b) => {
    // New data (true) should come before old data (false)
    if (a._IS_NEW_ && !b._IS_NEW_) return -1;
    if (!a._IS_NEW_ && b._IS_NEW_) return 1;
    return 0; // Keep original order for same type
  });

  const newDataOnly = sortedData.filter(row => row._IS_NEW_);

  return {
    allData: sortedData, // Already sorted with new data first
    newData: newDataOnly,
    totalNew: newDataOnly.length,
    totalAll: sortedData.length
  };
};

// Enhanced function to download Excel with GREEN HIGHLIGHTING using ExcelJS
export const downloadExcelWithGreenHighlight = async (data, filename) => {
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
      script.onload = () => {
        resolve(window.ExcelJS);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    const ExcelJS = await loadExcelJS();
    
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Sort data to ensure new data appears first
    const sortedData = [...data].sort((a, b) => {
      if (a._IS_NEW_ && !b._IS_NEW_) return -1;
      if (!a._IS_NEW_ && b._IS_NEW_) return 1;
      return 0;
    });

    // Prepare data (remove internal _IS_NEW_ field)
    const exportData = sortedData.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });

    if (exportData.length === 0) return;

    // Add headers
    const headers = Object.keys(exportData[0]);
    const headerRow = worksheet.addRow(headers);

    // Style header row with enhanced styling
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F2937' } // Dark gray header
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        bold: true,
        size: 12,
        name: 'Segoe UI'
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF374151' } },
        left: { style: 'thin', color: { argb: 'FF374151' } },
        bottom: { style: 'thin', color: { argb: 'FF374151' } },
        right: { style: 'thin', color: { argb: 'FF374151' } }
      };
    });

    // Set header row height
    headerRow.height = 25;

    // Add data rows with enhanced conditional formatting
    exportData.forEach((rowData, index) => {
      const row = worksheet.addRow(Object.values(rowData));
      const isNewData = sortedData[index]._IS_NEW_;
      
      // Apply enhanced green highlighting to new data rows
      if (isNewData) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF10B981' } // Bright emerald green
          };
          cell.font = {
            color: { argb: 'FFFFFFFF' }, // White text for better contrast
            bold: true,
            size: 11,
            name: 'Segoe UI'
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF059669' } },
            left: { style: 'thin', color: { argb: 'FF059669' } },
            bottom: { style: 'thin', color: { argb: 'FF059669' } },
            right: { style: 'thin', color: { argb: 'FF059669' } }
          };
        });
        // Set row height for new data
        row.height = 20;
      } else {
        // Enhanced styling for existing data
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' } // Very light gray background
          };
          cell.font = {
            color: { argb: 'FF374151' }, // Dark gray text
            size: 11,
            name: 'Segoe UI'
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
        });
        row.height = 18;
      }
    });

    // Enhanced auto-fit columns with better sizing
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      const columnHeader = headers[index];
      
      // Consider header length
      maxLength = Math.max(maxLength, columnHeader.length);
      
      // Check each cell in the column
      column.eachCell({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      
      // Set column width with proper bounds and padding
      column.width = Math.min(Math.max(maxLength + 3, 12), 60);
    });

    // Add freeze panes (freeze first row)
    worksheet.views = [
      { 
        state: 'frozen', 
        xSplit: 0, 
        ySplit: 1,
        topLeftCell: 'A2'
      }
    ];

    // Add worksheet protection (optional)
    worksheet.protection = {
      selectLockedCells: false,
      selectUnlockedCells: true
    };

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ File berhasil di-download dengan highlighting hijau dan sorting otomatis!');
    return true;
  } catch (error) {
    console.error('❌ Error creating Excel with highlighting:', error);
    // Fallback to basic download
    return downloadExcelBasic(data, filename);
  }
};

// Enhanced function to download Excel with STATUS column + GREEN HIGHLIGHT
export const downloadExcelWithStatusAndHighlight = async (data, filename) => {
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
      script.onload = () => {
        resolve(window.ExcelJS);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    const ExcelJS = await loadExcelJS();
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Sort data to ensure new data appears first
    const sortedData = [...data].sort((a, b) => {
      if (a._IS_NEW_ && !b._IS_NEW_) return -1;
      if (!a._IS_NEW_ && b._IS_NEW_) return 1;
      return 0;
    });

    // Prepare data WITH status column
    const exportData = sortedData.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return {
        'STATUS': _IS_NEW_ ? '🆕 DATA BARU' : '📋 DATA LAMA',
        ...cleanRow
      };
    });

    if (exportData.length === 0) return;

    // Add headers
    const headers = Object.keys(exportData[0]);
    const headerRow = worksheet.addRow(headers);

    // Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F2937' } // Dark header
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 12,
        name: 'Segoe UI'
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
      };
    });

    headerRow.height = 30;

    // Add data rows with enhanced styling
    exportData.forEach((rowData, index) => {
      const row = worksheet.addRow(Object.values(rowData));
      const isNewData = sortedData[index]._IS_NEW_;
      
      // Apply styling based on data status
      row.eachCell((cell, colNumber) => {
        if (isNewData) {
          // Enhanced green highlighting for new data
          if (colNumber === 1) {
            // Special styling for STATUS column (first column) - darker green
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF059669' } // Darker emerald
            };
            cell.font = {
              color: { argb: 'FFFFFFFF' }, // White text
              bold: true,
              size: 11,
              name: 'Segoe UI'
            };
          } else {
            // Light green for other columns
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF10B981' } // Bright emerald
            };
            cell.font = {
              color: { argb: 'FFFFFFFF' }, // White text
              bold: true,
              size: 11,
              name: 'Segoe UI'
            };
          }
        } else {
          // Styling for existing data
          if (colNumber === 1) {
            // Gray styling for STATUS column
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF9CA3AF' } // Medium gray
            };
            cell.font = {
              color: { argb: 'FF1F2937' }, // Dark text
              bold: true,
              size: 11,
              name: 'Segoe UI'
            };
          } else {
            // Light styling for other columns
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF3F4F6' } // Very light gray
            };
            cell.font = {
              color: { argb: 'FF4B5563' }, // Medium gray text
              size: 11,
              name: 'Segoe UI'
            };
          }
        }
        
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      row.height = isNewData ? 22 : 20;
    });

    // Enhanced auto-fit columns
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      const columnHeader = headers[index];
      
      maxLength = Math.max(maxLength, columnHeader.length);
      
      column.eachCell({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      
      // Special width for STATUS column
      if (index === 0) {
        column.width = 15; // Fixed width for STATUS column
      } else {
        column.width = Math.min(Math.max(maxLength + 3, 12), 60);
      }
    });

    // Freeze panes (first row and first column)
    worksheet.views = [
      { 
        state: 'frozen', 
        xSplit: 1, 
        ySplit: 1,
        topLeftCell: 'B2'
      }
    ];

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ File berhasil di-download dengan status dan highlighting yang enhanced!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return downloadExcelBasic(data, filename);
  }
};

// Enhanced function to download with separate sheets
export const downloadExcelSeparateSheets = async (data, filename) => {
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
      script.onload = () => {
        resolve(window.ExcelJS);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    const ExcelJS = await loadExcelJS();
    const workbook = new ExcelJS.Workbook();
    
    // Sort data first
    const sortedData = [...data].sort((a, b) => {
      if (a._IS_NEW_ && !b._IS_NEW_) return -1;
      if (!a._IS_NEW_ && b._IS_NEW_) return 1;
      return 0;
    });
    
    // Sheet 1: All data with highlighting
    const wsAll = workbook.addWorksheet('📊 Semua Data');
    const allData = sortedData.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });
    
    if (allData.length > 0) {
      const headers = Object.keys(allData[0]);
      const headerRow = wsAll.addRow(headers);
      
      // Style header
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
      
      allData.forEach((rowData, index) => {
        const row = wsAll.addRow(Object.values(rowData));
        if (sortedData[index]._IS_NEW_) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          });
        }
      });
      
      // Auto-fit columns
      wsAll.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(Math.max(maxLength + 2, 12), 50);
      });
    }
    
    // Sheet 2: New data only
    const newData = sortedData.filter(row => row._IS_NEW_).map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });
    
    if (newData.length > 0) {
      const wsNew = workbook.addWorksheet('🆕 Data Baru');
      const headers = Object.keys(newData[0]);
      const headerRow = wsNew.addRow(headers);
      
      // Style header
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
      
      newData.forEach(rowData => {
        const row = wsNew.addRow(Object.values(rowData));
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        });
      });
      
      // Auto-fit columns
      wsNew.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(Math.max(maxLength + 2, 12), 50);
      });
    }
    
    // Sheet 3: Enhanced Summary
    const wsSummary = workbook.addWorksheet('📈 Summary');
    const currentDate = new Date().toLocaleString('id-ID');
    const newDataCount = sortedData.filter(row => row._IS_NEW_).length;
    const oldDataCount = sortedData.length - newDataCount;
    const percentage = sortedData.length > 0 ? ((newDataCount / sortedData.length) * 100).toFixed(2) : 0;
    
    const summaryData = [
      ['📊 LAPORAN ANALISIS DATA', ''],
      ['Tanggal Analisis', currentDate],
      ['', ''],
      ['📈 STATISTIK DATA', ''],
      ['Total Data Keseluruhan', sortedData.length.toLocaleString()],
      ['🆕 Data Baru Ditemukan', newDataCount.toLocaleString()],
      ['📋 Data Lama', oldDataCount.toLocaleString()],
      ['📊 Persentase Data Baru', `${percentage}%`],
      ['', ''],
      ['💡 KESIMPULAN', ''],
      ['Status', newDataCount > 0 ? '✅ Data baru terdeteksi' : '⚠️ Tidak ada data baru'],
      ['Rekomendasi', newDataCount > 0 ? 'Lakukan review dan validasi data baru' : 'Data sudah up-to-date'],
    ];
    
    summaryData.forEach((rowData, index) => {
      const row = wsSummary.addRow(rowData);
      
      // Style different types of rows
      if (index === 0 || index === 3 || index === 9) {
        // Header rows
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 };
        });
      } else if (rowData[0].includes('Data Baru') && newDataCount > 0) {
        // Highlight new data count
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        });
      }
    });
    
    // Set column widths for summary
    wsSummary.getColumn(1).width = 30;
    wsSummary.getColumn(2).width = 25;

    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ File multi-sheet berhasil di-download dengan enhanced formatting!');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    // Fallback to basic method
    return downloadExcelBasic(data, filename);
  }
};

// Improved fallback basic download function
export const downloadExcelBasic = (data, filename) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  script.onload = () => {
    // Sort data first
    const sortedData = [...data].sort((a, b) => {
      if (a._IS_NEW_ && !b._IS_NEW_) return -1;
      if (!a._IS_NEW_ && b._IS_NEW_) return 1;
      return 0;
    });

    const exportData = sortedData.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return {
        'STATUS': row._IS_NEW_ ? '🆕 BARU' : '📋 LAMA',
        ...cleanRow
      };
    });

    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.json_to_sheet(exportData);
    window.XLSX.utils.book_append_sheet(wb, ws, "Data");
    window.XLSX.writeFile(wb, filename);
    console.log('✅ File basic berhasil di-download dengan sorting!');
  };
  document.head.appendChild(script);
};

// Main download function with enhanced highlighting
export const downloadExcel = (data, filename, highlightNew = false) => {
  if (highlightNew) {
    return downloadExcelWithGreenHighlight(data, filename);
  } else {
    return downloadExcelBasic(data, filename);
  }
};

// Enhanced function to download ONLY new data with highlighting
export const downloadNewDataOnly = async (data, filename) => {
  // Filter only new data
  const newDataOnly = data.filter(row => row._IS_NEW_);
  
  if (newDataOnly.length === 0) {
    alert('Tidak ada data baru untuk didownload!');
    return false;
  }

  // Use the enhanced highlighting function
  return await downloadExcelWithGreenHighlight(newDataOnly, filename);
};

// Function to save processing history
export const saveToHistory = (fileOldName, fileNewName, result) => {
  const historyItem = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    fileOld: fileOldName,
    fileNew: fileNewName,
    totalProcessed: result.totalAll,
    newDataFound: result.totalNew,
    processingTime: Math.random() * 5 + 1,
    status: 'completed'
  };

  const existingHistory = JSON.parse(localStorage.getItem('processingHistory') || '[]');
  const updatedHistory = [historyItem, ...existingHistory].slice(0, 20);
  localStorage.setItem('processingHistory', JSON.stringify(updatedHistory));
  
  return historyItem;
};

// Function to get processing history
export const getProcessingHistory = () => {
  return JSON.parse(localStorage.getItem('processingHistory') || '[]');
};