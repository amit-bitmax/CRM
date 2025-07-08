const express=require("express");
const { createLead, getAllLead, updatedLead, deleteLead, singleLead } = require("../controllers/leadController");
const validateToken = require("../utils/validateToken");
const { isAdmin } = require("../middleware/isAdmin");

const router=express.Router();

router.post('/create',createLead);
router.get('/',getAllLead);
router.put('/:id',updatedLead);
router.get('/:id',singleLead);
router.delete('/:id',validateToken, isAdmin,deleteLead);

module.exports=router;