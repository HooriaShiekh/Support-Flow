const Ticket = require('../models/Ticket');

// 1. Worker ki assigned tickets fetch karna
const getWorkerTickets = async (req, res) => {
    try {
        const workerId = req.user._id; // Auth middleware se logged-in worker ki ID
        const tickets = await Ticket.find({ assignedWorker: workerId }).populate('customer', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ticket ka status aur priority update karna (with professional details in response)
const updateTicketStatus = async (req, res) => {
    try {
        const { status, priority } = req.body;
        const ticketId = req.params.id;

        const ticket = await Ticket.findById(ticketId).populate('customer', 'name email');
        if (!ticket) {
            return res.status(404).json({ error: "Ticket nahi mili!" });
        }

        // Rule: Agar ticket pehle hi Completed ya Rejected ho chuki hai, toh dobara update nahi ho sakti
        if (ticket.status === 'Completed' || ticket.status === 'Rejected') {
            return res.status(400).json({ 
                error: "Error: Yeh ticket pehle hi Completed ya Rejected ho chuki hai, ab iska status change nahi ho sakta!" 
            });
        }

        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;

        await ticket.save();

        res.status(200).json({ 
            message: status === 'Rejected' 
                ? `Aapne ${ticket.customer?.name || 'Customer'} ki ticket (${ticket.ticketId || ticket._id.toString().slice(-6)}) ko reject kar diya hai.` 
                : "Ticket status successfully update ho gaya!", 
            ticket 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Ticket ko archive/hide karne ka controller function
const archiveWorkerTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: "Ticket nahi mili." });
        }

        ticket.isArchivedByWorker = true;
        await ticket.save();

        res.json({ message: "Ticket successfully archive ho gayi." });
    } catch (err) {
        res.status(500).json({ error: "Server error aagaya." });
    }
};

// Exporting all controller functions
module.exports = { getWorkerTickets, updateTicketStatus, archiveWorkerTicket };