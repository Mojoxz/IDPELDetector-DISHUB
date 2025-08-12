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

// Function to download Excel file with highlighting
export const downloadExcel = (data, filename, highlightNew = false) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  script.onload = () => {
    const exportData = data.map(row => {
      const { _IS_NEW_, ...cleanRow } = row;
      return cleanRow;
    });

    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.json_to_sheet(exportData);

    // Apply highlighting if requested
    if (highlightNew && data.some(row => row._IS_NEW_)) {
      const range = window.XLSX.utils.decode_range(ws['!ref']);
      
      // Create styles for highlighting
      const highlightStyle = {
        fill: {
          fgColor: { rgb: "FFFF00" } // Yellow background
        },
        font: {
          bold: true,
          color: { rgb: "000000" }
        }
      };

      // Apply highlighting to new data rows
      for (let rowNum = 1; rowNum <= range.e.r; rowNum++) { // Start from 1 to skip header
        const dataIndex = rowNum - 1;
        if (data[dataIndex] && data[dataIndex]._IS_NEW_) {
          // Highlight all cells in the row
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const cellAddress = window.XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            if (ws[cellAddress]) {
              ws[cellAddress].s = highlightStyle;
            }
          }
        }
      }
    }

    window.XLSX.utils.book_append_sheet(wb, ws, "Data");
    window.XLSX.writeFile(wb, filename);
  };
  document.head.appendChild(script);
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
    processingTime: Math.random() * 5 + 1, // Simulate processing time
    status: 'completed'
  };

  // Get existing history from localStorage (in real app, this would be from state or API)
  const existingHistory = JSON.parse(localStorage.getItem('processingHistory') || '[]');
  
  // Add new item to the beginning of the array
  const updatedHistory = [historyItem, ...existingHistory].slice(0, 20); // Keep only last 20 items
  
  // Save back to localStorage
  localStorage.setItem('processingHistory', JSON.stringify(updatedHistory));
  
  return historyItem;
};

// Function to get processing history
export const getProcessingHistory = () => {
  return JSON.parse(localStorage.getItem('processingHistory') || '[]');
};  