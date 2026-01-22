import db from "../models/index.js";
import {
  logHistory,
} from "../services/historyService.js";

const OrderReceivedDocumentModel = db.OrderReceivedDocumentModel;
const OrderReceivedDocumentHistory = db.OrderReceivedDocumentHistory;


export const uploadDocument = async (req, res) => {
  try {
    const { documentType, uploadedBy, OperatorId, OperatorName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = await OrderReceivedDocumentModel.create({
      documentType,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      uploadedBy
    });

    // Log to history
    await logHistory(
      OrderReceivedDocumentHistory,
      doc.id,
      "added",
      OperatorId,
      OperatorName,
      null,
      doc.toJSON()
    );

    res.status(201).json(doc);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    console.log("req.body from updateDocument controller : ", req.body);
    const { leadId, documentId, OperatorId, OperatorName } = req.body;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    console.log("doc", doc);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const previousData = doc.toJSON();
    const updatedDoc = await doc.update({
      leadId,
    });

    // Log to history
    await logHistory(
      OrderReceivedDocumentHistory,
      documentId,
      "updated",
      OperatorId,
      OperatorName,
      previousData,
      updatedDoc.toJSON()
    );

    res.status(201).json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getDocumentsByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const docs = await OrderReceivedDocumentModel.findAll({
      where: { leadId }
    });

    // res.json(docs);
    res.status(200).json({
      success: true,
      data: docs,
      message: "Documents details fetched successfully",
      error: {}
    });
  } catch (err) {
    // res.status(500).json({ error: err.message });
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching documents details",
      error: err.message
    });
  }   
      
};

export const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.download(path.resolve(doc.filePath), doc.originalFileName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await OrderReceivedDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    fs.unlinkSync(doc.filePath);
    await doc.destroy();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
