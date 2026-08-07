const prisma = require('../config/db');

// POST /api/messages
exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'receiverId and content are required' });
  }
  if (receiverId === senderId) {
    return res.status(400).json({ error: 'Cannot message yourself' });
  }

  try {
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// GET /api/messages/:userId
exports.getConversation = async (req, res) => {
  const otherUserId = req.params.userId;
  const myId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};
// GET /api/messages/unread-count
exports.getUnreadCount = async (req, res) => {
  const myId = req.user.id;

  try {
    const count = await prisma.message.count({
      where: { receiverId: myId, read: false },
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

// PUT /api/messages/:userId/mark-read
exports.markAsRead = async (req, res) => {
  const myId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: myId, read: false },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

// GET /api/messages
// GET /api/messages
exports.getConversationsList = async (req, res) => {
  const myId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: myId }, { receiverId: myId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, email: true, role: true, profile: { select: { fullName: true } } } },
        receiver: { select: { id: true, email: true, role: true, profile: { select: { fullName: true } } } },
      },
    });

    // Collapse into one entry per conversation partner, keeping only the most recent message
    const conversationsMap = new Map();
    for (const msg of messages) {
      const partner = msg.senderId === myId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(partner.id)) {
        conversationsMap.set(partner.id, {
          partner,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unread: false,
        });
      }
      // Mark unread if any message FROM this partner TO me is unread
      if (msg.senderId === partner.id && msg.receiverId === myId && !msg.read) {
        conversationsMap.get(partner.id).unread = true;
      }
    }

    res.json({ conversations: Array.from(conversationsMap.values()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch conversations list' });
  }
};
