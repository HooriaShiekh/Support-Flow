const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Notification = require('../models/Notification');

// 1. Category ke mutabiq workers fetch karna
const getWorkersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        // Database se woh users find karein jinka role 'worker' ho aur category match kare
        const workers = await User.find({ 
            role: 'worker', 
            category: { $regex: new RegExp(category, 'i') } // Case-insensitive search
        }).select('name email contactNumber rating totalReviews category');

        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. New Ticket / Complaint Create karna
const createTicket = async (req, res) => {
    try {
        const { title, description, category, assignedWorker } = req.body;

        // Unique Ticket ID generate karna (e.g., TCK-485920)
        const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);

        const newTicket = new Ticket({
            ticketId,
            customer: req.user._id, // Auth middleware se logged-in customer ki ID milegi
            title,
            description,
            category,
            assignedWorker: assignedWorker || null
        });

        await newTicket.save();
        res.status(201).json({ 
            message: 'Ticket generated successfully!', 
            ticket: newTicket 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Database se saari unique worker categories fetch karna
const getWorkerCategories = async (req, res) => {
    try {
        // Sirf workers role wale users ki distinct categories nikalna
        const categories = await User.find({ role: 'worker' }).distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1. Customer ki apni saari tickets fetch karna
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ customer: req.user._id }).populate('assignedWorker', 'name rating category');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ticket update/modify karna
// 2. Ticket update/modify karna
const updateTicket = async (req, res) => {
    try {
        // Yahan 'category' bhi add karein
        const { title, description, category } = req.body; 
        
        const ticket = await Ticket.findOne({ _id: req.params.id, customer: req.user._id });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found or you are not authorized' });
        }

        // Agar ticket Completed ya Rejected ho chuki hai toh update nahi ho sakti
        if (ticket.status === 'Completed' || ticket.status === 'Rejected') {
            return res.status(400).json({ error: 'Cannot update a completed or rejected ticket' });
        }

        // Nayi values assign karein
        ticket.title = title || ticket.title;
        ticket.description = description || ticket.description;
        ticket.category = category || ticket.category; // Yeh line add ki hai

        await ticket.save();

        res.status(200).json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Ticket delete/cancel karna
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, customer: req.user._id });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit Rating & Feedback
const submitFeedback = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const ticketId = req.params.id;

        const ticket = await Ticket.findOne({ _id: ticketId, customer: req.user.id });
        
        if (!ticket) {
            return res.status(404).json({ error: "Ticket nahi mili ya aap authorized nahi hain." });
        }

        // Check karein ke ticket Completed ya Resolved ho
        if (ticket.status !== 'Completed') {
            return res.status(400).json({ error: "Aap sirf completed tickets par hi feedback de sakte hain." });
        }

        ticket.rating = rating;
        ticket.feedback = feedback;
        await ticket.save();

        res.status(200).json({ message: "Feedback kamyabi se save ho gaya!", ticket });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Server error ki wajah se feedback save nahi ho saka." });
    } };


module.exports = { getWorkersByCategory, createTicket ,getWorkerCategories
    ,getMyTickets, updateTicket, deleteTicket, submitFeedback
};


