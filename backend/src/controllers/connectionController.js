const prisma = require('../config/db');

// POST /api/connections/request
exports.sendConnectionRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  if (!receiverId) {
    return res.status(400).json({ error: 'receiverId is required' });
  }
  if (receiverId === senderId) {
    return res.status(400).json({ error: 'Cannot connect with yourself' });
  }

  try {
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    if (existing) {
      return res.status(409).json({ error: 'Connection already exists', status: existing.status });
    }

    const connection = await prisma.connection.create({
      data: { senderId, receiverId },
    });

    res.status(201).json({ connection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

// PUT /api/connections/:id/respond
exports.respondToConnectionRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "ACCEPTED" or "REJECTED"
  const userId = req.user.id;

  if (!['ACCEPTED', 'REJECTED'].includes(action)) {
    return res.status(400).json({ error: 'action must be ACCEPTED or REJECTED' });
  }

  try {
    const connection = await prisma.connection.findUnique({ where: { id } });

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    if (connection.receiverId !== userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: { status: action },
    });

    res.json({ connection: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to respond to connection request' });
  }
};

// GET /api/connections
exports.getMyConnections = async (req, res) => {
  const userId = req.user.id;

  try {
    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, email: true, role: true, profile: true } },
        receiver: { select: { id: true, email: true, role: true, profile: true } },
      },
    });

    res.json({ connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
};

// GET /api/connections/pending
exports.getPendingRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const pending = await prisma.connection.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: { select: { id: true, email: true, role: true, profile: true } },
      },
    });

    res.json({ pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};
// GET /api/connections/pending-count
exports.getPendingCount = async (req, res) => {
  const userId = req.user.id;

  try {
    const count = await prisma.connection.count({
      where: { receiverId: userId, status: 'PENDING' },
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending count' });
  }
};
// GET /api/connections/sent
exports.getSentRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const sent = await prisma.connection.findMany({
      where: { senderId: userId, status: 'PENDING' },
      include: {
        receiver: { select: { id: true, email: true, role: true, profile: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
};