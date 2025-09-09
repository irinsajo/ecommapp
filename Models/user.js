const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    phone: {
        type: String,   // Use string to avoid leading 0 issues
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "blocked"], // Optional: restrict values
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
