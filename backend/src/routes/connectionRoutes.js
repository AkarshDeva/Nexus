const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  sendConnectionRequest,
  respondToConnectionRequest,
  getMyConnections,
  getPendingRequests,
  getPendingCount,
  getSentRequests,
} = require('../controllers/connectionController');

router.post('/request', authMiddleware, sendConnectionRequest);
router.get('/pending-count', authMiddleware, getPendingCount);
router.get('/sent', authMiddleware, getSentRequests);
router.put('/:id/respond', authMiddleware, respondToConnectionRequest);
router.get('/', authMiddleware, getMyConnections);
router.get('/pending', authMiddleware, getPendingRequests);

module.exports = router;