import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function PdfViewerDialog(props) {
  console.log("props of pdfViewDialog : ", props);
  const { open, onClose, pdfUrl, title } = props;
  // console.log("title of the object : ", title);
  // console.log("onClose object : ", onClose);
  // console.log("pdfUrl object : ", pdfUrl);


  
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
        {title}
        <IconButton onClick={onClose} sx={{ maxWidth: 45 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: "80vh", width: "100%" }}>
          <object
            data={pdfUrl}
            width="100%"
            // type= {`application/${title.split('.').pop().toLowerCase()}`}
            type="application/pdf"
            height="100%"
          >
            <Box p={2}>
              <Typography color="error">
                PDF cannot be displayed.
              </Typography>
              <Typography>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  Click here to download the {title}
                </a>
              </Typography>
            </Box>
          </object>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
