const mongoose = require("mongoose");

// Define a schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    hostedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
}, { timestamps: true });

// Create a model
const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel; // Use CommonJS export