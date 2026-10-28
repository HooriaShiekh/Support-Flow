const express = require('express');
const router = express.Router();

// 1. Controllers import karein (reassignTicketAdmin bhi shamil kar liya hai)
const { 
    getAllUsersAndWorkers, 
    deleteUserOrWorker, 
    getAdminStats,
    getAllTicketsAdmin,
    reassignTicketAdmin // 🌟 Yeh add kiya
} = require('../controllers/adminController');

// 2. Middlewares import karein
const verifyToken = require('../middleware/verifyToken'); 
const adminMiddleware = require('../middleware/adminMiddleware'); 

// 🌟 Admin Routes
router.get('/stats', verifyToken, adminMiddleware, getAdminStats);
router.get('/users', verifyToken, adminMiddleware, getAllUsersAndWorkers);
router.get('/tickets', verifyToken, adminMiddleware, getAllTicketsAdmin);
router.delete('/user/:id', verifyToken, adminMiddleware, deleteUserOrWorker);

// 🌟 Manual Worker Re-assignment Route
router.put('/ticket/:ticketId/reassign', verifyToken, adminMiddleware, reassignTicketAdmin);

module.exports = router;