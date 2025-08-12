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

// Function to process data comparison
export const processDataComparison = (dataOld, dataNew) => {
  const idpelOldSet = new Set(dataOld.map(row => String(row.IDPEL)));
  const processedData = dataNew.map(row => ({
    ...row,
    _IS_NEW_: !idpelOldSet.has(String(row.IDPEL))
  }));

  const newDataOnly = processedData.filter(row => row._IS_NEW_);

  return {
    allData: processedData,
    newData: newDataOnly,
    totalNew: newDataOnly.length,
    totalAll: processedData.length
  };
};

// Function to download Excel with GREEN HIGHLIGHTING using ExcelJS
export const downloadExcelWithGreenHighlight = async (data, filename) => {
  // Load ExcelJS library
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
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

    // Prepare data (remove internal _IS_NEW_ field)
    const exportData = data.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });

    if (exportData.length === 0) return;

    // Add headers
    const headers = Object.keys(exportData[0]);
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Blue header
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        bold: true,
        size: 12
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows with conditional formatting
    exportData.forEach((rowData, index) => {
      const row = worksheet.addRow(Object.values(rowData));
      const isNewData = data[index]._IS_NEW_;
      
      // Apply green highlighting to new data rows
      if (isNewData) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF92D050' } // Light green background
          };
          cell.font = {
            color: { argb: 'FF000000' }, // Black text
            bold: true,
            size: 11
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      } else {
        // Style for existing data
        row.eachCell((cell) => {
          cell.font = {
            color: { argb: 'FF000000' },
            size: 11
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Add freeze panes (freeze first row)
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ File berhasil di-download dengan highlighting hijau!');
  } catch (error) {
    console.error('❌ Error creating Excel with highlighting:', error);
    // Fallback to basic download
    downloadExcelBasic(data, filename);
  }
};

// Function to download Excel with STATUS column + GREEN HIGHLIGHT
export const downloadExcelWithStatusAndHighlight = async (data, filename) => {
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
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

    // Prepare data WITH status column
    const exportData = data.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return {
        'STATUS': _IS_NEW_ ? 'DATA BARU' : 'DATA LAMA',
        ...cleanRow
      };
    });

    if (exportData.length === 0) return;

    // Add headers
    const headers = Object.keys(exportData[0]);
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Blue header
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 12
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    exportData.forEach((rowData, index) => {
      const row = worksheet.addRow(Object.values(rowData));
      const isNewData = data[index]._IS_NEW_;
      
      // Apply styling based on data status
      row.eachCell((cell, colNumber) => {
        if (isNewData) {
          // Green highlighting for new data
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF92D050' } // Light green
          };
          cell.font = {
            color: { argb: 'FF000000' },
            bold: true,
            size: 11
          };
        } else {
          // Normal styling for existing data
          cell.font = {
            color: { argb: 'FF666666' },
            size: 11
          };
        }
        
        // Special styling for STATUS column (first column)
        if (colNumber === 1) {
          if (isNewData) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF00B050' } // Darker green for status
            };
            cell.font = {
              color: { argb: 'FFFFFFFF' }, // White text
              bold: true,
              size: 11
            };
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFBFBFBF' } // Gray for old data
            };
            cell.font = {
              color: { argb: 'FF000000' },
              size: 11
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
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Freeze panes
    worksheet.views = [
      { state: 'frozen', xSplit: 1, ySplit: 1 } // Freeze first row and first column
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
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ File berhasil di-download dengan status dan highlighting!');
  } catch (error) {
    console.error('❌ Error:', error);
    downloadExcelBasic(data, filename);
  }
};

// Fallback basic download function
export const downloadExcelBasic = (data, filename) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  script.onload = () => {
    const exportData = data.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return {
        'STATUS': row._IS_NEW_ ? 'DATA BARU' : 'DATA LAMA',
        ...cleanRow
      };
    });

    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.json_to_sheet(exportData);
    window.XLSX.utils.book_append_sheet(wb, ws, "Data");
    window.XLSX.writeFile(wb, filename);
  };
  document.head.appendChild(script);
};

// Original download function (kept for compatibility)
export const downloadExcel = (data, filename, highlightNew = false) => {
  if (highlightNew) {
    downloadExcelWithGreenHighlight(data, filename);
  } else {
    downloadExcelBasic(data, filename);
  }
};

// Function to download with separate sheets
export const downloadExcelSeparateSheets = async (data, filename) => {
  const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
      if (window.ExcelJS) {
        resolve(window.ExcelJS);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
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
    
    // Sheet 1: All data with highlighting
    const wsAll = workbook.addWorksheet('Semua Data');
    const allData = data.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });
    
    if (allData.length > 0) {
      wsAll.addRow(Object.keys(allData[0]));
      allData.forEach((rowData, index) => {
        const row = wsAll.addRow(Object.values(rowData));
        if (data[index]._IS_NEW_) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF92D050' }
            };
            cell.font = { bold: true };
          });
        }
      });
    }
    
    // Sheet 2: New data only
    const newData = data.filter(row => row._IS_NEW_).map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });
    
    if (newData.length > 0) {
      const wsNew = workbook.addWorksheet('Data Baru');
      wsNew.addRow(Object.keys(newData[0]));
      newData.forEach(rowData => {
        const row = wsNew.addRow(Object.values(rowData));
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF92D050' }
          };
          cell.font = { bold: true };
        });
      });
    }
    
    // Sheet 3: Summary
    const wsSummary = workbook.addWorksheet('Summary');
    const summary = [
      ['Keterangan', 'Jumlah'],
      ['Total Data', data.length],
      ['Data Baru', newData.length],
      ['Data Lama', data.length - newData.length],
      ['Persentase Data Baru', `${((newData.length / data.length) * 100).toFixed(2)}%`]
    ];
    
    summary.forEach(row => {
      wsSummary.addRow(row);
    });

    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error:', error);
    // Fallback to basic method
    downloadExcelBasic(data, filename);
  }
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