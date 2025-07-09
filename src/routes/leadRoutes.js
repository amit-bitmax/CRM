const express = require("express");
const { createLead, getAllLead, updatedLead, deleteLead, singleLead, activeLead, getInactiveLeads, makeInactiveLead, sendMultipleEmails, getByUser } = require("../controllers/leadController");
const validateToken = require("../utils/validateToken");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post('/', validateToken, createLead);
router.get('/', getAllLead);
router.put('/:id', updatedLead);
router.get('/:id', singleLead);
router.delete('/:id', validateToken, isAdmin, deleteLead);
router.get("/status/active", activeLead);
router.get("/status/inactive", getInactiveLeads);
router.put("/make/status", isAdmin, makeInactiveLead);
router.get("/user-leads/user", validateToken, getByUser);
module.exports = router;