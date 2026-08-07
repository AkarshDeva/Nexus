const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  deleteOpportunity,
} = require('../controllers/opportunityController');

// POST /api/opportunities
router.post('/', authMiddleware, createOpportunity);

// GET /api/opportunities
router.get('/', getAllOpportunities);

// GET /api/opportunities/:id
router.get('/:id', getOpportunityById);

// DELETE /api/opportunities/:id
router.delete('/:id', authMiddleware, deleteOpportunity);

module.exports = router;