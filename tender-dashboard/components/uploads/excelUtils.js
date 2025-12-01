// components/upload/excelUtils.js - Excel Utility Functions

import * as XLSX from 'xlsx';

/**
 * Read Excel file and convert to JSON
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Failed to read Excel file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate Excel data against field specifications
 */
export const validateExcelData = (data, fields) => {
  const errors = [];
  const fieldKeys = fields.map(f => f.key || f.label);

  // Check if data is empty
  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: ['Excel file is empty']
    };
  }

  // Check headers
  const headers = Object.keys(data[0]);
  const missingHeaders = fieldKeys.filter(
    field => !headers.some(h => h.toLowerCase() === field.toLowerCase())
  );

  if (missingHeaders.length > 0) {
    errors.push(`Missing columns: ${missingHeaders.join(', ')}`);
  }

  // Validate each row
  const validatedData = [];
  data.forEach((row, idx) => {
    const validRow = {};
    let isValid = true;

    fields.forEach(field => {
      const key = field.key || field.label;
      const value = row[key] || row[key.toLowerCase()];

      // Check required fields
      if (field.required && !value) {
        errors.push(`Row ${idx + 1}: ${field.label} is required`);
        isValid = false;
      }

      // Type validation
      if (value) {
        if (field.type === 'number' && isNaN(value)) {
          errors.push(`Row ${idx + 1}: ${field.label} must be a number`);
          isValid = false;
        }
        if (field.type === 'date' && isNaN(Date.parse(value))) {
          errors.push(`Row ${idx + 1}: ${field.label} must be a valid date`);
          isValid = false;
        }
      }

      validRow[key] = value;
    });

    if (isValid) {
      validatedData.push(validRow);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
};

/**
 * Generate sample Excel file
 */
export const generateSampleExcel = (fields, formType = 'data') => {
  // Create sample data
  const sampleData = [
    fields.reduce((obj, field) => {
      obj[field.label || field.key] = field.sampleValue || getSampleValue(field.type);
      return obj;
    }, {})
  ];

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = fields.map(f => ({
    wch: Math.max(15, (f.label || f.key).length + 5)
  }));
  worksheet['!cols'] = colWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Generate file name
  const fileName = `${formType}-template-${new Date().toISOString().split('T')[0]}.xlsx`;

  // Download
  XLSX.writeFile(workbook, fileName);
};

/**
 * Get sample value based on field type
 */
const getSampleValue = (type) => {
  const samples = {
    text: 'Sample Text',
    number: '1000',
    currency: '10000.00',
    date: new Date().toISOString().split('T')[0],
    email: 'sample@example.com',
    phone: '9876543210',
    select: 'Option 1',
    textarea: 'Sample long text content'
  };
  return samples[type] || 'Sample Data';
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data, columns, filename = 'export') => {
  const excelData = data.map(row => {
    const obj = {};
    columns.forEach(col => {
      obj[col.label] = row[col.key];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Convert Excel data to CSV
 */
export const exportToCSV = (data, columns, filename = 'export') => {
  const csvContent = [
    columns.map(col => col.label).join(','),
    ...data.map(row =>
      columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
