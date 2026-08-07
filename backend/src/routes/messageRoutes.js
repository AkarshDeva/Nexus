const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  sendMessage,
  getConversation,
  getConversationsList,
  getUnreadCount,
  markAsRead,
} = require('../controllers/messageController');

router.post('/', authMiddleware, sendMessage);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.get('/:userId', authMiddleware, getConversation);
router.put('/:userId/mark-read', authMiddleware, markAsRead);
router.get('/', authMiddleware, getConversationsList);

module.exports = router;