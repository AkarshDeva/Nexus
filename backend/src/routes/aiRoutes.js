const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProfileFeedback,
  matchOpportunity,
  generateRoadmap,
  getInterviewPrep,
  getMentorMatches,
  getProjectIdeas,
} = require('../controllers/aiController');

router.post('/profile-feedback', authMiddleware, getProfileFeedback);
router.post('/match-opportunity/:id', authMiddleware, matchOpportunity);
router.post('/roadmap', authMiddleware, generateRoadmap);
router.post('/interview-prep', authMiddleware, getInterviewPrep);
router.post('/mentor-match', authMiddleware, getMentorMatches);
router.post('/project-ideas', authMiddleware, getProjectIdeas);

module.exports = router;