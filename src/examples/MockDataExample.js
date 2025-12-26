// Example: How to Use Mock Data for Testing
// File: src/examples/MockDataExample.js

import React, { useState, useEffect } from 'react';
import { mockBudgetaryQuotationData, updateMockBQ, addMockBQ } from '../mockData/budgetaryQuotationMockData';

/**
 * Example Component showing how to use mock data
 * This can be used for quick testing without backend
 */
const MockDataExample = () => {
  const [data, setData] = useState(mockBudgetaryQuotationData);

  // ============================================
  // Example 1: Load Mock Data on Component Mount
  // ============================================
  useEffect(() => {
    console.log('Mock data loaded:', data);
  }, []);

  // ============================================
  // Example 2: Update a Record
  // ============================================
  const handleUpdateRecord = (recordId) => {
    const updatedRecord = updateMockBQ(recordId, {
      customerName: 'Updated Customer Name',
      presentStatus: 'Won',
      estimateValueInCrWithoutGST: 99.99,
    });

    // Refresh component state to see changes
    setData({ ...data, data: [...data.data] });

    console.log('Record updated:', updatedRecord);
    alert(`Record ${recordId} updated successfully!`);
  };

  // ============================================
  // Example 3: Add New Record
  // ============================================
  const handleAddRecord = () => {
    const newRecord = addMockBQ({
      bqTitle: 'Test BQ Record',
      customerName: 'Test Customer',
      customerAddress: 'Test Address',
      leadOwner: 'Test Lead',
      defenceAndNonDefence: 'Non-Defence',
      estimateValueInCrWithoutGST: 10.5,
      submittedValueInCrWithoutGST: 10.0,
      dateOfLetterSubmission: new Date().toISOString().split('T')[0],
      referenceNo: 'TEST-001',
      JSON_competitors: 'Test Competitors',
      presentStatus: 'Budgetary Quotation Submitted',
      remarks: 'Test record',
    });

    setData({ ...data, data: [...data.data] });
    console.log('New record added:', newRecord);
    alert('New record added successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mock Data Testing Examples</h2>

      {/* Display total records */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <p><strong>Total Records:</strong> {data.data.length}</p>
      </div>

      {/* Buttons for testing */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => handleUpdateRecord('BQ001')}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✏️ Test Update BQ001
        </button>

        <button 
          onClick={() => handleUpdateRecord('BQ002')}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✏️ Test Update BQ002
        </button>

        <button 
          onClick={handleAddRecord}
          style={{
            padding: '10px 15px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Add New Record
        </button>
      </div>

      {/* Display all records in a table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1e40af', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>BQ Title</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Customer</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Estimate (Cr)</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((record) => (
              <tr 
                key={record.id}
                style={{
                  backgroundColor: record.id === 'BQ001' ? '#e0f2fe' : 'white',
                  borderBottom: '1px solid #ddd'
                }}
              >
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <strong>{record.id}</strong>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {record.bqTitle}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {record.customerName}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#d1fae5',
                    borderRadius: '4px',
                    fontSize: '0.85em'
                  }}>
                    {record.presentStatus}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  ₹{record.estimateValueInCrWithoutGST}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: record.defenceAndNonDefence === 'Defence' ? '#fecdd3' : '#bfdbfe',
                    borderRadius: '4px',
                    fontSize: '0.85em'
                  }}>
                    {record.defenceAndNonDefence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Console Log Guide */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderLeft: '4px solid #1e40af',
        borderRadius: '4px'
      }}>
        <h3>📋 Testing Instructions:</h3>
        <ul>
          <li>Click <strong>"Test Update"</strong> buttons to simulate record updates</li>
          <li>Click <strong>"Add New Record"</strong> to test adding new records</li>
          <li>Open DevTools (F12) → Console to see logs</li>
          <li>Check table updates in real-time</li>
          <li>All changes are stored in <code>mockBudgetaryQuotationData.data</code></li>
        </ul>
        <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
          Note: This is for testing only. Use real API endpoint in production.
        </p>
      </div>

      {/* Display JSON */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.85em',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <strong style={{ color: '#569cd6' }}>Current Mock Data (JSON):</strong>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default MockDataExample;

// ============================================
// USAGE IN MAIN COMPONENT
// ============================================

/**
 * To use mock data in BudgetaryQuotationForm.js:
 * 
 * 1. Import mock data at the top:
 *    import { mockBudgetaryQuotationData } from '../mockData/budgetaryQuotationMockData';
 * 
 * 2. Replace useEffect in BudgetaryQuotationForm:
 * 
 *    useEffect(() => {
 *      // FOR TESTING - Use mock data
 *      setOrderData(mockBudgetaryQuotationData);
 *      
 *      // FOR PRODUCTION - Use real API call
 *      // axios.get(`/config.json`)...
 *    }, []);
 * 
 * 3. Run the component and test the edit functionality
 * 
 * 4. When backend is ready, switch back to axios call
 */
