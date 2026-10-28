const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jis ko notification milni hai (Customer)
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }, // Jis ticket se related hai
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);