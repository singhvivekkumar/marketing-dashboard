import React from 'react';
import { Button } from '@mui/material';

function BulkUpload({ tabName }) {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Implement file parsing (e.g., using XLSX library) and upload to the database.
        console.log("Uploaded File:", file);
    }

    return (
        <div>
            <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
            <Button>Upload</Button>
        </div>
    );
}

export default BulkUpload;