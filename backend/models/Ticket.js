const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    assignedWorker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed', 'Rejected'], 
        default: 'Pending' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    // ---- Yeh 2 nayi fields yahan add karni hain ----
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    feedback: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);