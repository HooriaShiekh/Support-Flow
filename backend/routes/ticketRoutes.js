const express = require('express');
const router = express.Router();

// Ticket controllers
const { 
    getWorkersByCategory, 
    createTicket, 
    getWorkerCategories,
    getMyTickets,
    updateTicket,
    deleteTicket,
    submitFeedback
} = require('../controllers/ticketController');
// Auth middleware
const { protect } = require('../middleware/authMiddleware');

// Worker controllers
const { 
    getWorkerTickets, 
    updateTicketStatus 
} = require('../controllers/workerController');

// --- PUBLIC / GENERAL TICKET ROUTES ---
router.get('/categories', protect, getWorkerCategories);
router.get('/workers/:category', protect, getWorkersByCategory);

// --- CUSTOMER ROUTES ---
router.post('/create', protect, createTicket);
router.get('/my-tickets', protect, getMyTickets);

// Unique paths taake Express confuse na ho
router.put('/customer/update/:id', protect, updateTicket);       // Customer ticket update
router.delete('/customer/delete/:id', protect, deleteTicket);    // Customer ticket delete


// --- WORKER ROUTES ---
router.get('/worker-tickets', protect, getWorkerTickets);
router.put('/worker/update-status/:ticketId', protect, updateTicketStatus); // Worker status update

router.put('/customer/feedback/:id', protect, submitFeedback);

module.exports = router;