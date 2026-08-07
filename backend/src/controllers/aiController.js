const prisma = require('../config/db');
const { askMistral } = require('../services/aiService');

// POST /api/ai/profile-feedback
exports.getProfileFeedback = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: { select: { role: true } } },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const prompt = `You are a career coach reviewing a ${profile.user.role.toLowerCase()}'s profile on a career networking platform.

Name: ${profile.fullName}
Bio: ${profile.bio || 'Not provided'}
Skills: ${profile.skills?.join(', ') || 'Not provided'}
Location: ${profile.location || 'Not provided'}
GitHub: ${profile.githubUrl || 'Not provided'}

Give short, specific, encouraging feedback in this exact format:
1. **Strengths** (2 bullet points max)
2. **What to improve** (2-3 bullet points max)
3. **One quick win** (1 specific actionable suggestion)

Keep it concise, warm, and practical. Use plain text with markdown bullets, no long paragraphs.`;

    const feedback = await askMistral(prompt);

    res.json({ feedback });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
};
// POST /api/ai/match-opportunity/:id
exports.matchOpportunity = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [profile, opportunity] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.opportunity.findUnique({ where: { id } }),
    ]);

    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const prompt = `You are helping a candidate understand their fit for an opportunity on a career platform.

CANDIDATE PROFILE:
Bio: ${profile.bio || 'Not provided'}
Skills: ${profile.skills?.join(', ') || 'Not provided'}

OPPORTUNITY:
Title: ${opportunity.title}
Type: ${opportunity.type}
Description: ${opportunity.description}
Skills needed: ${opportunity.skillsNeeded?.join(', ') || 'Not specified'}

Respond in this exact format:
Match Score: X/10
**Why:** one short sentence
**Missing skills:** comma-separated list, or "None — you're a strong match"

Keep it under 60 words total. Be honest, not falsely encouraging.`;

    const result = await askMistral(prompt);

    res.json({ result });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate match analysis' });
  }
};
// POST /api/ai/roadmap
exports.generateRoadmap = async (req, res) => {
  const userId = req.user.id;
  const { targetRole } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole is required' });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const prompt = `A student wants to become a: ${targetRole}

Their current skills: ${profile.skills?.join(', ') || 'None listed'}

Give a short learning roadmap to help them get there. Format exactly like this:

**Step 1:** [skill/topic] — one line why it matters
**Step 2:** [skill/topic] — one line why it matters
**Step 3:** [skill/topic] — one line why it matters
**Step 4:** [skill/topic] — one line why it matters

Only include skills they don't already have. Keep each line under 20 words. Be specific and practical, not generic.`;

    const roadmap = await askMistral(prompt);

    res.json({ roadmap });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};
// POST /api/ai/interview-prep
exports.getInterviewPrep = async (req, res) => {
  const userId = req.user.id;
  const { targetRole } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole is required' });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const prompt = `A candidate with these skills: ${profile.skills?.join(', ') || 'general skills'} is preparing to interview for: ${targetRole}

Give exactly 5 realistic interview questions they should practice — a mix of technical and behavioral.

Format exactly like this, no extra text:

**Q1:** [question]
*What they're looking for:* one short line

**Q2:** [question]
*What they're looking for:* one short line

(continue through Q5)

Keep each "looking for" line under 15 words.`;

    const prep = await askMistral(prompt);

    res.json({ prep });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate interview prep' });
  }
};
// POST /api/ai/mentor-match
exports.getMentorMatches = async (req, res) => {
  const userId = req.user.id;

  try {
    const myProfile = await prisma.profile.findUnique({ where: { userId } });
    if (!myProfile) return res.status(404).json({ error: 'Profile not found' });

    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR', id: { not: userId } },
      include: { profile: true },
    });

    if (mentors.length === 0) {
      return res.json({ matches: 'No mentors have joined the platform yet — check back soon!' });
    }

    const mentorList = mentors
      .map((m, i) => `${i + 1}. ${m.profile?.fullName || 'Unnamed'} — Skills: ${m.profile?.skills?.join(', ') || 'none listed'} — Bio: ${m.profile?.bio || 'none'}`)
      .join('\n');

    const prompt = `A student has these skills: ${myProfile.skills?.join(', ') || 'none listed'} and this bio: ${myProfile.bio || 'not provided'}

Here is a list of available mentors:
${mentorList}

Pick the TOP 2 best-fit mentors for this student from the list above only. Format exactly like this:

**1. [mentor name]** — one short line on why they're a good fit
**2. [mentor name]** — one short line on why they're a good fit

If none are a good fit, say so honestly in one line instead.`;

    const matches = await askMistral(prompt);

    res.json({ matches });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate mentor matches' });
  }
};
// POST /api/ai/project-ideas
exports.getProjectIdeas = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const prompt = `A student has these skills: ${profile.skills?.join(', ') || 'general beginner skills'}

Suggest 3 portfolio project ideas that would help them practice these skills and stand out to recruiters. Format exactly like this:

**1. [project name]** — one line description
*Skills used:* comma-separated list

**2. [project name]** — one line description
*Skills used:* comma-separated list

**3. [project name]** — one line description
*Skills used:* comma-separated list

Make the ideas specific and interesting, not generic like "build a to-do app". Keep descriptions under 20 words.`;

    const ideas = await askMistral(prompt);

    res.json({ ideas });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to generate project ideas' });
  }
};