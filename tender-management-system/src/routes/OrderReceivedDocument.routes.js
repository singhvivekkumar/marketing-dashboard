import { deleteDocument, downloadDocument, getDocumentsByLead, uploadDocument, updateDocument } from "../controllers/orderReceivedDocument.controller.js";
import multer from "multer";


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/leads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	}
});

const upload = multer({ storage });

export const OrderReceivedDocumentRouter = (app) => {

	app.use(function (req, res, next) {
		//console.log("req",req.body)
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	console.log("OrderReceivedDocumentRouter hitted");

	app.post(
		"/uploadDocument",
		upload.single("file"),
		uploadDocument
	);

	app.put(
		"/updateDocument",
		updateDocument
	);

	app.get(
		"/leads/:leadId/documents",
		getDocumentsByLead
	);

	app.get(
		"/documents/:documentId/download",
		downloadDocument
	);

	app.delete(
		"/documents/:document_id",
		deleteDocument
	);

};
