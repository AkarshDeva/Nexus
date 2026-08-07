const prisma = require('../config/db');

// POST /api/opportunities
exports.createOpportunity = async (req, res) => {
  const { title, description, type, skillsNeeded } = req.body;
  const postedById = req.user.id;

  if (!title || !description || !type) {
    return res.status(400).json({ error: 'title, description, and type are required' });
  }

  try {
    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        description,
        type,
        skillsNeeded: skillsNeeded || [],
        postedById,
      },
    });

    res.status(201).json({ opportunity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
};

// GET /api/opportunities
exports.getAllOpportunities = async (req, res) => {
  const { type, skill } = req.query;

  try {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        ...(type && { type }),
        ...(skill && { skillsNeeded: { has: skill } }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        postedBy: {
          select: { id: true, role: true, profile: { select: { fullName: true } } },
        },
      },
    });

    res.json({ opportunities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
};

// GET /api/opportunities/:id
exports.getOpportunityById = async (req, res) => {
  const { id } = req.params;

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: { id: true, role: true, profile: { select: { fullName: true, bio: true } } },
        },
      },
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({ opportunity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
};

// DELETE /api/opportunities/:id
exports.deleteOpportunity = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const opportunity = await prisma.opportunity.findUnique({ where: { id } });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    if (opportunity.postedById !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this opportunity' });
    }

    await prisma.opportunity.delete({ where: { id } });

    res.json({ message: 'Opportunity deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
};