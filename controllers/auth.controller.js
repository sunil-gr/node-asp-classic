const User = require('../models/user.model');
const UserSecurity = require('../models/userSecurity.model');
const Customer = require('../models/customer.model');
const jwt = require('jsonwebtoken');

const validatePassword = (password) => {
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must have at least one upper case letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must have at least one numeric character.";
    }
    if (!/[!@#$^*]/.test(password)) {
        return "Password must have at least one special character (!@#$^*).";
    }
    return null; // Password is valid
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        // Create a new Customer for this user
        const newCustomer = await Customer.create({
            name: `${username}'s Company`,
            type: 'company' // Default type
        });

        // Create the user and associate them with the new customer
        const user = await User.create({
            username,
            password,
            customerId: newCustomer.id
        });
        
        // Create a corresponding security record
        await UserSecurity.create({ userId: user.id });
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username },
            include: { model: Customer, attributes: ['id', 'name'] }
        });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isValid = await user.validPassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Include customerId in the JWT payload
        const token = jwt.sign(
            { id: user.id, username: user.username, customerId: user.customerId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ message: 'Logged in successfully!', token: token });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}; 