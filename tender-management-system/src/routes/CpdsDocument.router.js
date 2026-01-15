import {
		uploadDocument,
		updateDocument,
		replaceDocumentFile,
		downloadCpdsDocumentById,
		deleteCpdsDocumentById,
		getDocumentsByCpdsId,
	} from "../controllers/CpdsDocumentController.js";
	import multer from "multer";
	
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "uploads/CpdsDocument");
		},
		filename: (req, file, cb) => {
			cb(null, `${Date.now()}_${file.originalname}`);
		},
	});
	
	const upload = multer({ storage });
	
	export const CPDSDocumentRouter = (app) => {
		app.use(function (req, res, next) {
			//console.log("req",req.body)
			res.header(
				"Access-Control-Allow-Headers",
				"x-access-token, Origin, Content-Type, Accept"
			);
			next();
		});
		console.log("hitted Order Received Document Router");
	
		app.post("/cpds/uploadDocument", upload.single("file"), uploadDocument);
	
		app.put("/cpds/updateDocument", updateDocument);
	
		app.put("/cpds/documents/:documentId/replace",upload.single("file"), replaceDocumentFile);
	
		app.get("/cpds/documents/:cpdsSlno", getDocumentsByCpdsId);
	
		app.get("/cpds/documents/:documentId/download", downloadCpdsDocumentById);
	
		app.delete("/cpds/documents/:documentId", deleteCpdsDocumentById);
	};