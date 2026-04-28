const User = require('../models/User');
const { generateToken } = require('../utils/token');

// @desc    Register user
const register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, confirmPassword, role } = req.body;
        
        // Validation
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }
        
        // Check existing user
        const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or phone number'
            });
        }
        
        // Create user
        const user = await User.create({
            name,
            email,
            phoneNumber,
            password,
            role: role || 'user'
        });
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get profile
const getProfile = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

// @desc    Update profile
const updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            user.password = newPassword;
        }
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login, getProfile, updateProfile };