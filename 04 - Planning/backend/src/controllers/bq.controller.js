const path                 = require('path');
const fs                   = require('fs');
const { Op }               = require('sequelize');
const { validationResult } = require('express-validator');
const BQ                   = require('../models/BQ.model');
const User                 = require('../models/User.model');

// ─── Helper: delete file from local disk ─────────────────────────────────────
const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  const abs = path.join(__dirname, '../../', filePath);
  if (fs.existsSync(abs)) {
    fs.unlinkSync(abs);
  }
};

// ─── GET /api/bq ─────────────────────────────────────────────────────────────
exports.list = async (req, res, next) => {
  try {
    const {
      defence_type, status, search,
      page = 1, limit = 20,
    } = req.query;

    const where = { is_deleted: false };

    if (defence_type) where.defence_type = defence_type;
    if (status)       where.present_status = status;
    if (search) {
      where[Op.or] = [
        { bq_title:       { [Op.iLike]: `%${search}%` } },
        { customer_name:  { [Op.iLike]: `%${search}%` } },
        { reference_no:   { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await BQ.findAndCountAll({
      where,
      include: [
        { model: User, as: 'lead_owner', attributes: ['id','full_name','username'] },
        { model: User, as: 'creator',    attributes: ['id','full_name'] },
      ],
      order:  [['created_at', 'DESC']],
      limit:  parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data:    rows,
      pagination: {
        total:       count,
        page:        parseInt(page),
        limit:       parseInt(limit),
        total_pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/bq ────────────────────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If file was uploaded but validation failed, remove it
      if (req.file) deleteLocalFile(`uploads/bq/${req.file.filename}`);
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const {
      bq_title, customer_name, customer_address,
      lead_owner_id, defence_type,
      estimated_value_cr, submitted_value_cr,
      submission_date, reference_no,
      competitors, present_status,
    } = req.body;

    const bq = await BQ.create({
      bq_title, customer_name, customer_address,
      lead_owner_id: lead_owner_id || null,
      defence_type, estimated_value_cr, submitted_value_cr,
      submission_date, reference_no, competitors, present_status,
      document_path: req.file ? `uploads/bq/${req.file.filename}` : null,
      document_name: req.file ? req.file.originalname : null,
      created_by:    req.user.id,
    });

    res.status(201).json({ success: true, data: bq, message: 'BQ created successfully.' });
  } catch (err) {
    if (req.file) deleteLocalFile(`uploads/bq/${req.file.filename}`);
    next(err);
  }
};

// ─── GET /api/bq/:id ─────────────────────────────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const bq = await BQ.findOne({
      where: { id: req.params.id, is_deleted: false },
      include: [
        { model: User, as: 'lead_owner', attributes: ['id','full_name','username'] },
        { model: User, as: 'creator',    attributes: ['id','full_name'] },
      ],
    });

    if (!bq) return res.status(404).json({ success: false, error: 'BQ record not found.' });

    res.json({ success: true, data: bq });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/bq/:id ─────────────────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const bq = await BQ.findOne({
      where: { id: req.params.id, is_deleted: false },
    });

    if (!bq) {
      if (req.file) deleteLocalFile(`uploads/bq/${req.file.filename}`);
      return res.status(404).json({ success: false, error: 'BQ record not found.' });
    }

    const {
      bq_title, customer_name, customer_address,
      lead_owner_id, defence_type,
      estimated_value_cr, submitted_value_cr,
      submission_date, reference_no,
      competitors, present_status,
    } = req.body;

    // If new file uploaded, delete the old file from disk
    if (req.file && bq.document_path) {
      deleteLocalFile(bq.document_path);
    }

    await bq.update({
      bq_title, customer_name, customer_address,
      lead_owner_id: lead_owner_id || null,
      defence_type, estimated_value_cr, submitted_value_cr,
      submission_date, reference_no, competitors, present_status,
      document_path: req.file ? `uploads/bq/${req.file.filename}` : bq.document_path,
      document_name: req.file ? req.file.originalname : bq.document_name,
      updated_at:    new Date(),
    });

    res.json({ success: true, data: bq, message: 'BQ updated successfully.' });
  } catch (err) {
    if (req.file) deleteLocalFile(`uploads/bq/${req.file.filename}`);
    next(err);
  }
};

// ─── DELETE /api/bq/:id ──────────────────────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const bq = await BQ.findOne({
      where: { id: req.params.id, is_deleted: false },
    });

    if (!bq) return res.status(404).json({ success: false, error: 'BQ record not found.' });

    // Soft delete — file kept on disk for audit purposes
    await bq.update({ is_deleted: true, updated_at: new Date() });

    res.json({ success: true, message: 'BQ deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/bq/:id/download ────────────────────────────────────────────────
exports.download = async (req, res, next) => {
  try {
    const bq = await BQ.findOne({
      where: { id: req.params.id, is_deleted: false },
    });

    if (!bq || !bq.document_path) {
      return res.status(404).json({ success: false, error: 'No document found for this BQ.' });
    }

    const abs = path.join(__dirname, '../../', bq.document_path);
    if (!fs.existsSync(abs)) {
      return res.status(404).json({ success: false, error: 'File not found on server.' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${bq.document_name || 'bq_document.pdf'}"`);
    res.sendFile(abs);
  } catch (err) {
    next(err);
  }
};
