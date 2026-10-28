const express = require('express');
const router = express.Router();
// Yahan archiveTicket ki jagah archiveWorkerTicket import karein:
const { getWorkerTickets, updateTicketStatus, archiveWorkerTicket } = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

// 1. Worker ki assigned tickets fetch karne ka route
router.get('/my-assigned-tickets', protect, getWorkerTickets);

// 2. Worker dwara ticket ka status aur priority update karne ka route
router.put('/update-status/:id', protect, updateTicketStatus);

// 3. Worker ticket archive/hide karne ka route
router.delete('/archive-ticket/:id', protect, archiveWorkerTicket);

module.exports = router;