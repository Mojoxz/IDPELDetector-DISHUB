// Enhanced dataProcessor.jsx - Compatible with Python logic for multi-sheet processing

// Function to read Excel file with ALL SHEETS and progress
export const readExcelFileAllSheets = (file, type, setUploadProgress) => {
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
          
          // Target sheets like Python script
          const targetSheets = ["DMP", "DKP", "NGL", "RKT", "GDN"];
          const sheetsData = {};
          
          // Process each target sheet
          targetSheets.forEach(sheetName => {
            if (workbook.SheetNames.includes(sheetName)) {
              const worksheet = workbook.Sheets[sheetName];
              
              // Read all data first, then extract IDPEL column (column C)
              const jsonData = window.XLSX.utils.sheet_to_json(worksheet);
              
              // Extract IDPEL data (assuming IDPEL is in column C or has IDPEL header)
              const idpelData = jsonData.map(row => {
                // Try to find IDPEL in various ways
                let idpel = null;
                
                // Method 1: Look for IDPEL column directly
                if (row.IDPEL) {
                  idpel = row.IDPEL;
                }
                // Method 2: Look for column C (index 2) - convert to IDPEL
                else if (row.__EMPTY_2) {
                  idpel = row.__EMPTY_2;
                }
                // Method 3: Get first non-empty value that looks like IDPEL
                else {
                  const values = Object.values(row);
                  idpel = values.find(val => 
                    val && 
                    (String(val).length >= 10) && 
                    !isNaN(String(val).replace(/\D/g, ''))
                  );
                }
                
                return idpel ? { IDPEL: String(idpel).trim(), SHEET: sheetName } : null;
              }).filter(item => item && item.IDPEL);
              
              sheetsData[sheetName] = idpelData;
            }
          });
          
          resolve(sheetsData);
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

// Alternative function for single sheet processing (backward compatibility)
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

// Enhanced function to process data comparison for MULTIPLE SHEETS (Python-like logic)
export const processDataComparisonMultiSheet = (dataOld, dataNew) => {
  const targetSheets = ["DMP", "DKP", "NGL", "RKT", "GDN"];
  const results = {};
  let totalNewAll = 0;
  let totalProcessedAll = 0;

  targetSheets.forEach(sheet => {
    const oldSheetData = dataOld[sheet] || [];
    const newSheetData = dataNew[sheet] || [];
    
    if (oldSheetData.length === 0 && newSheetData.length === 0) {
      results[sheet] = {
        allData: [],
        newData: [],
        totalNew: 0,
        totalAll: 0,
        status: 'empty'
      };
      return;
    }

    // Create set of old IDPEL for faster lookup
    const idpelOldSet = new Set(oldSheetData.map(row => String(row.IDPEL)));
    
    // Process new data - mark which ones are truly new
    const processedData = newSheetData.map(row => ({
      ...row,
      _IS_NEW_: !idpelOldSet.has(String(row.IDPEL)),
      _SHEET_: sheet
    }));

    // Sort data: NEW data first, then OLD data
    const sortedData = processedData.sort((a, b) => {
      if (a._IS_NEW_ && !b._IS_NEW_) return -1;
      if (!a._IS_NEW_ && b._IS_NEW_) return 1;
      return 0;
    });

    const newDataOnly = sortedData.filter(row => row._IS_NEW_);

    results[sheet] = {
      allData: sortedData,
      newData: newDataOnly,
      totalNew: newDataOnly.length,
      totalAll: sortedData.length,
      status: 'processed'
    };

    totalNewAll += newDataOnly.length;
    totalProcessedAll += sortedData.length;
  });

  return {
    sheetResults: results,
    totalNewAll: totalNewAll,
    totalProcessedAll: totalProcessedAll,
    processedSheets: targetSheets.filter(sheet => results[sheet].status === 'processed')
  };
};

// Function to process data comparison with automatic sorting (Single sheet - backward compatibility)
export const processDataComparison = (dataOld, dataNew) => {
  const idpelOldSet = new Set(dataOld.map(row => String(row.IDPEL)));
  const processedData = dataNew.map(row => ({
    ...row,
    _IS_NEW_: !idpelOldSet.has(String(row.IDPEL))
  }));

  // Sort data: NEW data first, then OLD data
  const sortedData = processedData.sort((a, b) => {
    if (a._IS_NEW_ && !b._IS_NEW_) return -1;
    if (!a._IS_NEW_ && b._IS_NEW_) return 1;
    return 0;
  });

  const newDataOnly = sortedData.filter(row => row._IS_NEW_);

  return {
    allData: sortedData,
    newData: newDataOnly,
    totalNew: newDataOnly.length,
    totalAll: sortedData.length
  };
};

// Enhanced function to download Excel with MULTIPLE SHEETS (Python-style output)
export const downloadExcelMultiSheet = async (multiSheetResult, filename) => {
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
    
    // Create summary sheet first
    const summaryWs = workbook.addWorksheet('📊 SUMMARY');
    const currentDate = new Date().toLocaleString('id-ID');
    
    const summaryData = [
      ['📊 LAPORAN ANALISIS IDPEL MULTI-SHEET', ''],
      ['Tanggal Analisis', currentDate],
      ['', ''],
      ['📈 RINGKASAN PER SHEET', ''],
      ['Sheet', 'Total Data', 'Data Baru', 'Persentase'],
      ['', '', '', ''],
    ];
    
    // Add per-sheet summary
    Object.keys(multiSheetResult.sheetResults).forEach(sheetName => {
      const sheetData = multiSheetResult.sheetResults[sheetName];
      if (sheetData.status === 'processed' && sheetData.totalAll > 0) {
        const percentage = ((sheetData.totalNew / sheetData.totalAll) * 100).toFixed(1);
        summaryData.push([
          `📋 ${sheetName}`,
          sheetData.totalAll.toLocaleString(),
          `🆕 ${sheetData.totalNew.toLocaleString()}`,
          `${percentage}%`
        ]);
      }
    });
    
    summaryData.push(['', '', '', '']);
    summaryData.push(['🎯 TOTAL KESELURUHAN', '', '', '']);
    summaryData.push(['Total Data Diproses', multiSheetResult.totalProcessedAll.toLocaleString(), '', '']);
    summaryData.push(['Total Data Baru', `🆕 ${multiSheetResult.totalNewAll.toLocaleString()}`, '', '']);
    
    summaryData.forEach((rowData, index) => {
      const row = summaryWs.addRow(rowData);
      
      if (index === 0 || index === 3 || rowData[0].includes('TOTAL KESELURUHAN')) {
        // Header rows
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 };
        });
      } else if (rowData[0].includes('📋') && rowData[2].includes('🆕')) {
        // Sheet data rows with new data
        row.eachCell((cell, colIndex) => {
          if (colIndex === 3) { // New data column
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          }
        });
      } else if (rowData[0].includes('Total Data Baru')) {
        // Total new data row
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        });
      }
    });
    
    // Set column widths for summary
    summaryWs.getColumn(1).width = 35;
    summaryWs.getColumn(2).width = 15;
    summaryWs.getColumn(3).width = 15;
    summaryWs.getColumn(4).width = 12;

    // Create sheets for each processed sheet - NEW DATA ONLY (like Python script)
    Object.keys(multiSheetResult.sheetResults).forEach(sheetName => {
      const sheetResult = multiSheetResult.sheetResults[sheetName];
      
      if (sheetResult.status === 'processed' && sheetResult.newData.length > 0) {
        const ws = workbook.addWorksheet(`🆕 ${sheetName} BARU`);
        
        // Add headers
        const headers = ['IDPEL'];
        const headerRow = ws.addRow(headers);
        
        // Style header
        headerRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        
        // Add new data only
        sheetResult.newData.forEach(rowData => {
          const row = ws.addRow([rowData.IDPEL]);
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            cell.alignment = { horizontal: 'center' };
          });
        });
        
        // Auto-fit column
        ws.getColumn(1).width = 20;
        
        // Freeze header
        ws.views = [{ state: 'frozen', ySplit: 1 }];
      }
    });
    
    // Create a combined sheet with all new data
    const combinedNewData = [];
    Object.keys(multiSheetResult.sheetResults).forEach(sheetName => {
      const sheetResult = multiSheetResult.sheetResults[sheetName];
      if (sheetResult.status === 'processed') {
        sheetResult.newData.forEach(item => {
          combinedNewData.push({
            SHEET: sheetName,
            IDPEL: item.IDPEL
          });
        });
      }
    });
    
    if (combinedNewData.length > 0) {
      const wsCombined = workbook.addWorksheet('🌟 SEMUA DATA BARU');
      
      const headers = ['SHEET', 'IDPEL'];
      const headerRow = wsCombined.addRow(headers);
      
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
      
      combinedNewData.forEach(rowData => {
        const row = wsCombined.addRow([rowData.SHEET, rowData.IDPEL]);
        row.eachCell((cell, colIndex) => {
          if (colIndex === 1) {
            // Sheet name column
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          } else {
            // IDPEL column
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          }
          cell.alignment = { horizontal: 'center' };
        });
      });
      
      wsCombined.getColumn(1).width = 15;
      wsCombined.getColumn(2).width = 20;
      wsCombined.views = [{ state: 'frozen', ySplit: 1 }];
    }

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
    
    console.log('✅ File multi-sheet berhasil di-download dengan format seperti Python script!');
    return true;
    
  } catch (error) {
    console.error('❌ Error creating multi-sheet Excel:', error);
    return downloadExcelBasic(combinedNewData, filename);
  }
};

// Keep all existing functions for backward compatibility
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
    totalProcessed: result.totalProcessedAll || result.totalAll,
    newDataFound: result.totalNewAll || result.totalNew,
    processingTime: result.processingTime || (Math.random() * 5 + 1).toFixed(2),
    status: 'completed',
    processedSheets: result.processedSheets || []
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