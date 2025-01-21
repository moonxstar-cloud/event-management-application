// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        index: true
    },
    endDate: { type: String },
    location: {
        type: String,
        index: true
    },
    description: { type: String },
    tickets: {
        type: String,
        default: "Free"
    },
    requireApproval: {
        type: Boolean,
        default: false
    },
    capacity: {
        type: Number,
        default: "Infinity "
    },
    timezone: {
        type: String,
    },
    image: {
        url: {
            type: String,
            default: null
        },
        filename: {
            type: String,
            default: null
        }
    },
    timezone: { type: String },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the User model
    }],
    attendeeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);