// utils/formatters.js

const formatDeadline = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).replace(',', '').replace(' 20', " '"); // "22 Mar '26"
};

const formatValue = (value) => {
  if (!value) return '₹0.00';
  const num = parseFloat(value);
  return isNaN(num) ? '₹0.00' : `₹${num.toFixed(2)}`;
};

const abbreviateName = (fullName) => {
  if (!fullName) return 'N/A';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}`; // "Rajesh Kumar" → "Rajesh K"
};

export default { formatDeadline, formatValue, abbreviateName };