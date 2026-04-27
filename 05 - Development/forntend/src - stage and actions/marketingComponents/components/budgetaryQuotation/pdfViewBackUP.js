import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export function PdfViewerDialog({
  open,
  onClose,
  fileName,
  hardDiskFileName,
  ServerIp,
}) {
  console.log("title of the object : ", fileName);
  // console.log("pdfUrl object : ", pdfUrl);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let currentUrl = null;

    const fetchFile = async () => {
      if (!open || !hardDiskFileName) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${ServerIp}/getBudgetaryQuotation/downloadFile`,
          {
            responseType: "blob",
            params: { hardDiskFileName: hardDiskFileName },
          }
        );

        // Create the Blob URL
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        currentUrl = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(currentUrl);
      } catch (error) {
        console.error("Preview error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // Cleanup: Revoke URL when dialog closes or file changes to prevent memory leaks
    return () => {
      if (currentUrl) {
        window.URL.revokeObjectURL(currentUrl);
        setPdfUrl(null);
      }
    };
  }, [open, hardDiskFileName, ServerIp]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {fileName}
        <IconButton onClick={onClose} sx={{ maxWidth: 45 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: "80vh", width: "100%" }}>
          {loading ? (
            <Typography sx={{ color: "white", p: 2 }}>
              Loading Preview...
            </Typography>
          ) : (
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <Box p={2}>
                <Typography color="error">PDF cannot be displayed.</Typography>
                <Typography>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    Click here to download the PDF
                  </a>
                </Typography>
              </Box>
            </object>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
