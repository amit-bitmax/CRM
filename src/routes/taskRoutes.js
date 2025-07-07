const express = require('express');
const upload = require('../utils/taskFile');
const { createTask, singleTask, getAll, updatedTask, deleteTask } = require('../controllers/taskController');
const { isAdmin } = require('../middleware/isAdmin');
const validateToken = require('../utils/validateToken');

const router = express.Router();

router.post("/create", upload.single("image"), createTask);
router.get("/:id", singleTask);
router.get("/all", getAll);
router.put("/:id", upload.single("image"), updatedTask);
router.delete("/:id",validateToken, isAdmin,  deleteTask);

module.exports = router;