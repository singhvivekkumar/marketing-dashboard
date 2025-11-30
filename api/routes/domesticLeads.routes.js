const express = require('express');
const router = express.Router();
const controller = require('../controllers/lostDomesticLeadsController');

router.get('/', controller.getAllLeads);
router.get('/:id', controller.getLeadById);
router.post('/', controller.createLead);
router.put('/:id', controller.updateLead);
router.delete('/:id', controller.deleteLead);

module.exports = router;