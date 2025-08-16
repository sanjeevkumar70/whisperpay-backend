const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Generate random 8-char alphanumeric ID
const generateUserId = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

exports.register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "Name, email, phone, and password are required" });
    }

    try {
        // Check if email or phone already exists
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) return res.status(400).json({ message: "Email already exists" });

        const phoneExists = await User.findOne({ where: { phone } });
        if (phoneExists) return res.status(400).json({ message: "Phone number already exists" });

        // Generate unique ID
        let userId;
        let isUnique = false;
        while (!isUnique) {
            userId = generateUserId();
            const existingUser = await User.findByPk(userId);
            if (!existingUser) isUnique = true;
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await User.create({
            id: userId,
            name,
            email,
            phone,
            password: hashedPassword,
            level: 1,
            payment_verified: false,
            role: "user"
        });

        res.status(201).json({ message: "User registered successfully", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, usertype: user.role});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};
