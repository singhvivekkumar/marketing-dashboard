import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function ViewData({ tabName }) {
    // Replace with your actual data fetching logic based on tabName
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        // Simulate data fetching
        setData([
            { id: 1, field1: 'Value 1', field2: 'Value 2' },
            { id: 2, field1: 'Value 3', field2: 'Value 4' },
        ]);
    }, [tabName]); // Fetch data whenever the tab changes

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Field 1</TableCell>
                    <TableCell>Field 2</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.field1}</TableCell>
                        <TableCell>{row.field2}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ViewData;