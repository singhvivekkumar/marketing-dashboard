import React from 'react';
import { Card, CardActions, CardContent, Button } from '@mui/material';

function ButtonCard({ onAction }) {
  return (
    <Card>
      <CardContent>
        {/* You can add a title or description here if you like */}
      </CardContent>
      <CardActions>
        <Button onClick={() => onAction('view')} size="small">View Data</Button>
        <Button onClick={() => onAction('create')} size="small">Create Entry</Button>
        <Button onClick={() => onAction('upload')} size="small">Bulk Upload</Button>
      </CardActions>
    </Card>
  );
}

export default ButtonCard;