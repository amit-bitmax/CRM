const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Author = require('../models/Auth');
//------------------< REGISTER Admin WITHOUT OTP >------------------//
exports.register = async (req, res) => {
    try {
        const { user_name, first_name, last_name, mobile, email, password, role } = req.body;

        if (!user_name || !first_name || !last_name || !mobile || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are mandatory", status: false });
        }

        // ✅ Check if trying to create Admin and Admin already exists
        if (role === "Admin") {
            const existingAdmin = await Author.findOne({ role: "Admin" });
            if (existingAdmin) {
                return res.status(400).json({ message: "An Admin already exists. Cannot create another Admin.", status: false });
            }
        }

        // ✅ Check duplicate email or mobile
        const existingAuthor = await Author.findOne({ $or: [{ email }, { mobile }] });
        if (existingAuthor) {
            const conflictField = existingAuthor.email === email ? 'email' : 'mobile';
            return res.status(400).json({
                message: `User with the provided ${conflictField} already exists.`,
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = req.file ? req.file.filename : "not available";

        const adminId = req.user?.role === "Admin" ? req.user.id : null;

        const newAuthor = await Author.create({
            user_name,
            name: { first_name, last_name },
            mobile,
            email,
            password: hashedPassword,
            profileImage,
            role,
            adminId
        });

        return res.status(201).json({ message: 'Registration successful!', status: true, data: newAuthor });

    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------< LOGIN >------------------//
exports.login = async (req, res) => {
    try {
        const { user_name, password } = req.body;

        if (!user_name || !password) {
            return res.status(400).json({ message: 'All fields are mandatory', status: false });
        }

        const admin = await Author.findOne({ user_name });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: "Invalid user_name or Password", status: false });
        }

        const accessToken = jwt.sign({
            user: {
                id: admin._id,
                user_name: admin.user_name,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '200m' });

        return res.status(200).json({
            message: "Login Successful",
            status: true,
            data: {
                accessToken,
                details: admin
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------< GET ALL AdminS >------------------//
exports.getAll = async (req, res) => {
    try {
        const admins = await Author.find({});
        if (!admins.length) {
            return res.status(404).json({ message: 'No admins found', status: false });
        }
        return res.status(200).json({ message: 'Admins fetched successfully', status: true, data: admins });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------< PROFILE DETAILS >------------------//
exports.profile = async (req, res) => {
    try {
        const admin = await Author.findById(req.user?.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found', status: false });
        }
        return res.status(200).json({ message: 'Profile fetched successfully', status: true, data: admin });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------< UPDATE PROFILE >------------------//
exports.updatedProfile = async (req, res) => {
    const adminId = req.user?.id;
    try {
        const admin = await Author.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found", status: false });
        }

        const { user_name, first_name, last_name, mobile, email } = req.body;
        const profileImage = req.file?.filename;

        admin.user_name = user_name || admin.user_name;
        admin.name.first_name = first_name || admin.name.first_name;
        admin.name.last_name = last_name || admin.name.last_name;
        admin.mobile = mobile || admin.mobile;
        admin.email = email || admin.email;
        if (profileImage) admin.profileImage = profileImage;

        await admin.save();

        return res.status(200).json({ message: "Profile updated successfully", status: true, data: admin });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

//------------------< DELETE Admin (Admin Only) >------------------//
exports.deleteAdmin = async (req, res) => {
    try {
        // Token ke through aane wale user ki role check karo
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Only Admin can delete authors.", status: false });
        }

        const { id } = req.params;
        const author = await Author.findByIdAndDelete(id);

        if (!author) {
            return res.status(404).json({ message: "Author not found", status: false });
        }

        return res.status(200).json({ message: "Author deleted successfully", status: true });

    } catch (error) {
        console.error("Error deleting author:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false });
    }
};

let virtualOtp = null;
let virtualid;
exports.sendOtpToResetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.', status: false, data: null });
    }

    try {
        const userInfo = await Author.findOne({ email });

        if (!userInfo) {
            return res.status(404).json({ message: 'Email is not registered. Please sign up.', status: false, data: null });
        }
        virtualid = userInfo._id;
        const genOtp = generateOtp();
        virtualOtp = genOtp;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${genOtp} to reset your password.`
        });

        return res.status(200).json({ message: 'OTP sent to your email. Please check your inbox.', status: true, data: null });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Internal server error.', status: false, data: null });
    }
};


//------------------< CHANGE PASSWORD OTP >------------------//
exports.changePasswordByOtp = async (req, res) => {
    try {
        let otpAttempts = 0;
        const { password, confirm_password, otp } = req.body;
        console.log(password, confirm_password, otp);
        if (!password || !confirm_password || !otp) {
            return res.status(400).json({ message: 'All fields are mandatory', status: false, data: null });
        }
        if (otpAttempts >= 3) {
            virtualOtp = null;
            return res.status(400).json({ message: 'Your OTP has expired', status: false, data: null });
        }
        if (virtualOtp !== otp) {
            otpAttempts++;
            return res.status(400).json({ message: 'OTP does not match. Please enter the correct OTP', status: false, data: null });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ message: "Passwords do not match", status: false, data: null });
        }
        const newHashedPassword = await bcrypt.hash(password, 10);
        const update = { password: newHashedPassword };
        const updatedUser = await Author.findByIdAndUpdate(virtualid, update, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", status: false, data: null });
        }
        virtualOtp = null;
        otpAttempts = 0;
        return res.status(200).json({ message: "Password changed successfully", status: true, data: updatedUser });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ message: 'Internal Server Error', status: false, data: null });
    }
};

