const User = require('../models/User');
const Ticket = require('../models/Ticket');

// 1. Get All Users and Workers (Admin Overview)
const getAllUsersAndWorkers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Delete User or Worker
const deleteUserOrWorker = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Admin khud ko delete na kar sake
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Account deleted successfully by Admin' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Admin Platform Stats (Total Users, Total Workers, Total Tickets)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalWorkers = await User.countDocuments({ role: 'worker' });
        const totalTickets = await Ticket.countDocuments();

        res.json({
            totalUsers,
            totalWorkers,
            totalTickets
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Master Ticket Oversight (Saari tickets fetch karne ke liye)
const getAllTicketsAdmin = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('customer', 'name email contactNumber')
            .populate('assignedWorker', 'name email category')
            .sort({ createdAt: -1 });

        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching all tickets for admin:", error);
        res.status(500).json({ error: error.message });
    }
};

// 5. 🌟 Ticket Override / Manual Worker Re-assignment
const reassignTicketAdmin = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { workerId } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        ticket.assignedWorker = workerId || null;
        if (workerId && ticket.status === 'Pending') {
            ticket.status = 'In Progress'; // Automatic status update if assigned
        }
        await ticket.save();

        const updatedTicket = await Ticket.findById(ticketId)
            .populate('customer', 'name email contactNumber')
            .populate('assignedWorker', 'name email category');

        res.status(200).json({ 
            message: "Ticket reassigned successfully!", 
            ticket: updatedTicket 
        });
    } catch (error) {
        console.error("Error reassigning ticket:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsersAndWorkers,
    deleteUserOrWorker,
    getAdminStats,
    getAllTicketsAdmin,
    reassignTicketAdmin // 🌟 Exporting reassign controller
};