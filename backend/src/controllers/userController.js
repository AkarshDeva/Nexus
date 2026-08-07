const prisma = require('../config/db');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  const myId = req.user.id;
  const { role } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: myId },
        ...(role && { role }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: { fullName: true, bio: true, skills: true, location: true },
        },
      },
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};