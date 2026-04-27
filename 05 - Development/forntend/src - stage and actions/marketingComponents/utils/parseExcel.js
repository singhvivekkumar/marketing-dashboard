// ExcelParser.js (optional, for cleaner separation)
import * as XLSX from 'xlsx';

const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result);
        const sheetNames = workbook.SheetNames;

        const parsedData = {};
        sheetNames.forEach(sheetName => {
          const ws = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); //Header as first row
          parsedData[sheetName] = data;
        });

        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export default parseExcel;