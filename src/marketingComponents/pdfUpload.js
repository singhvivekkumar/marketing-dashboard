import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PdfViewerDialog({
  open,
  onClose,
  pdfUrl,
  title = "Document Viewer",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: "80vh", width: "100%" }}>
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <Box p={2}>
              <Typography color="error">
                PDF cannot be displayed.
              </Typography>
              <Typography>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  Click here to download the PDF
                </a>
              </Typography>
            </Box>
          </object>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { Button } from "@mui/material";
import PdfViewerDialog from "./PdfViewerDialog";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        View Document
      </Button>

      <PdfViewerDialog
        open={open}
        onClose={() => setOpen(false)}
        pdfUrl="/documents/sample.pdf"
        title="Tender Document"
      />
    </>
  );
}
