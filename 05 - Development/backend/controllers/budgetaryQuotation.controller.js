const LostDomesticLead = require('../models/LostDomesticLead');

// Format response helper based on guide
const sendResponse = (res, data, message = 'Operation successful') => {
  res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

exports.getAllLeads = async (req, res, next) => {
  try {
    const leads = await LostDomesticLead.findAll();
    sendResponse(res, leads);
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await LostDomesticLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    sendResponse(res, lead);
  } catch (err) {
    next(err);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    // Basic Validation
    if (!req.body.tender_name || !req.body.customer) {
      return res.status(400).json({ success: false, message: 'Tender Name and Customer are required' });
    }
    const newLead = await LostDomesticLead.create(req.body);
    sendResponse(res, newLead, 'Lead created successfully');
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const updatedLead = await LostDomesticLead.update(req.params.id, req.body);
    if (!updatedLead) return res.status(404).json({ success: false, message: 'Lead not found or no changes made' });
    sendResponse(res, updatedLead, 'Lead updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const deleted = await LostDomesticLead.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Lead not found' });
    sendResponse(res, null, 'Lead deleted successfully');
  } catch (err) {
    next(err);
  }
};