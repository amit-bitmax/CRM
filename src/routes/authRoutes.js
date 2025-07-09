const express = require('express')
const { register, login, profile, getAll, updatedProfile, deleteAdmin, sendOtpToResetPassword, changePasswordByOtp } = require('../controllers/authController');

const upload = require('../utils/uploadProfileFile');
const { limiter } = require('../utils/rateLimer');
const { loginValidation } = require('../utils/loginValidation');
const validateToken = require('../utils/validateToken');
const { isAdmin } = require('../middleware/isAdmin');
const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", loginValidation, limiter, login);
router.get("/profile", validateToken, profile);
router.get("/all", getAll);
router.put("/update", upload.single("profileImage"), validateToken, updatedProfile);
router.delete("/:id", validateToken, isAdmin, deleteAdmin);
router.post('/otp-reset-password', sendOtpToResetPassword);
router.post('/change-password-otp', changePasswordByOtp);
module.exports = router;