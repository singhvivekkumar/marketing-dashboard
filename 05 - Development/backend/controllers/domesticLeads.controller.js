// controllers/leadController.js
const Lead = require("../models/leadModel");

const createLead = async (req, res) => {
  try {
    const payload = req.body;
    // basic validation
    if (!payload.serial_number || !payload.tender_name || !payload.customer) {
      return res.status(400).json({ error: "serial_number, tender_name and customer are required" });
    }

    // convert numeric fields if present
    if (payload.emd_value_crore !== undefined && payload.emd_value_crore !== "") {
      payload.emd_value_crore = Number(payload.emd_value_crore);
    }

    const lead = await Lead.create(payload);
    return res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: "Not found" });
    return res.json(lead);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const listLeads = async (req, res) => {
  try {
    const { page, limit, customer, status, tender_type } = req.query;
    const leads = await Lead.list({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      customer, status, tender_type
    });
    return res.json(leads);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateLead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    const updated = await Lead.update(id, payload);
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteLead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Lead.remove(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createLead, getLead, listLeads, updateLead, deleteLead };
