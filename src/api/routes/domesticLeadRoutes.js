// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/leadController");

router.post("/", controller.createLead);         // create
router.get("/", controller.listLeads);           // list
router.get("/:id", controller.getLead);         // single
router.put("/:id", controller.updateLead);      // update
router.delete("/:id", controller.deleteLead);   // delete

module.exports = router;