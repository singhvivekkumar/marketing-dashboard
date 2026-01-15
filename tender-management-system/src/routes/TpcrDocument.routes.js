import {
    uploadDocument,
    updateDocument,
    replaceDocumentFile,
    downloadTpcrDocumentById,
    deleteTpcrDocumentById,
    getDocumentsBytpcrId,
  } from "../controllers/TpcrDocumentController.js";
  import multer from "multer";
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/tpcrDocument");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  export const TpcrDocumentRouter = (app) => {
    app.use(function (req, res, next) {
      //console.log("req",req.body)
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    console.log("hitted Order Received Document Router");
  
    app.post("/uploadTpcrDocument", upload.single("file"), uploadDocument);
  
    app.put("/updateTpcrDocument", updateDocument);
  
    app.put("/documents/:documentId/replace",upload.single("file"), replaceDocumentFile);
  
    app.get("/getTPCRForm/:tpcrSlno/documents", getDocumentsBytpcrId);
  
    app.get("/getTPCRForm/:documentId/download", downloadTpcrDocumentById);
  
    app.delete("/documents/:documentId", deleteTpcrDocumentById);
  };