// ✅ BEST & INDUSTRY-STANDARD (Recommended)
// Way-1: Create LEAD first (Draft / Pending), then upload documents

// Backend flow

// 2. POST /leads/{tcprId}/documents
//    → upload files
//    → save metadata with tcprId

// 1. POST /leads
//    → create lead with status = DRAFT
//    → return tcprId

// 3. PUT /leads/{tcprId}
//    → submit / finalize lead
//    → status = SUBMITTED


import db from "../models/index.js";
const TpcrDocumentModel = db.TpcrDocumentModel;
import path from "path";
import fs from "fs";

// Helper for consistent error formatting
function handleError(err, res, next) {
  // Log error for debugging (could use Winston/Morgan)
  console.error(err);
  // Pass error to centralized error handler if available
  if (next) return next(err);
  // Fallback: send generic error response
  res.status(500).json({
    success: false,
    data: null,
    error: err,
    message: "Internal server error"
  });
}

export const uploadDocument = async (req, res, next) => {
  try {
    const { documentType, uploadedBy } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }
    const doc = await TpcrDocumentModel.create({
      documentType,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      uploadedBy,
    });
    res.status(201).json(doc);
  } catch (err) {
    handleError(err, res, next);
  }
};

export const replaceDocumentFile = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }
    const doc = await TpcrDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    // delete old file from disk (if exists)
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }
    // update db record
    await doc.update({
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
    });
    res.status(202).json({
      message: "Document replaced successfully",
      doc,
    });
  } catch (err) {
    handleError(err, res, next);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const { tpcrId, documentId } = req.body;
    const doc = await TpcrDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    const updatedDoc = await doc.update({ tpcrId });
    res.status(202).json({ success: true, data: updatedDoc });
  } catch (err) {
    handleError(err, res, next);
  }
};

export const getDocumentsBytpcrId = async (req, res, next) => {
  try {
    const { tcprId } = req.params;
    const docs = await TpcrDocumentModel.findAll({ where: { tcprId } });
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    handleError(err, res, next);
  }
};

export const downloadTpcrDocumentById = async (req, res, next) => {
  try {
    const __dirname = path.resolve();
    let UPLOADS_DIR = path.join(__dirname, "uploads/orderReceivedDocument/");
    const { documentId } = req.params;
    const doc = await TpcrDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.download(UPLOADS_DIR + doc.storedFileName, doc.originalFileName);
  } catch (err) {
    handleError(err, res, next);
  }
};

export const deleteTpcrDocumentById = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const doc = await TpcrDocumentModel.findByPk(documentId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    fs.unlinkSync(doc.filePath);
    await doc.destroy();
    res.status(204).json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    handleError(err, res, next);
  }
};