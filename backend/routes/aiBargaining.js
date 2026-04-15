const express = require('express');
const router = express.Router();
const {
    startBargaining,
    sendMessage,
    getBargaining,
    getBargainingHistory,
    completeBargaining,
    cancelBargaining,
    getAllBargainings
} = require('../controllers/aiBargainingController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/start', protect, startBargaining);
router.post('/:bargainingId/message', protect, sendMessage);
router.get('/:bargainingId', protect, getBargaining);
router.get('/history', protect, getBargainingHistory);
router.post('/:bargainingId/complete', protect, completeBargaining);
router.delete('/:bargainingId', protect, cancelBargaining);

// Admin routes
router.get('/admin/all', protect, admin, getAllBargainings);

module.exports = router;
