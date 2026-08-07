const prisma = require('../config/db');

// GET /api/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { email: true, role: true, createdAt: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/profile/me
exports.updateMyProfile = async (req, res) => {
  const { fullName, bio, skills, githubUrl, resumeUrl, location } = req.body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(skills !== undefined && { skills }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(location !== undefined && { location }),
      },
    });

    res.json({ profile: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};