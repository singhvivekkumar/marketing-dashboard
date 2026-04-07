// src/utils/fileHelpers.js
// Triggers a browser download from a Blob (API response with responseType: 'blob')
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a   = document.createElement('a');
  a.href    = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// src/utils/formatters.js
// Format a date string to DD/MM/YYYY (Indian format)
export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// Format a decimal as ₹X.XX Cr
export function fmtCrore(val) {
  if (!val && val !== 0) return '—';
  return `₹${parseFloat(val).toFixed(2)} Cr`;
}

// Capitalise first letter
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
