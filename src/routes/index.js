const express = require('express');
const mcpController = require('../controllers/mcpController');
const { validateContext, validateApplyChanges } = require('../middlewares/validation');

const router = express.Router();

/**
 * @route   GET /api/context
 * @desc    Get context from CucumberStudio
 * @access  Public
 */
router.get('/context', validateContext, mcpController.getContext);

/**
 * @route   POST /api/apply
 * @desc    Apply changes to CucumberStudio
 * @access  Public
 */
router.post('/apply', validateApplyChanges, mcpController.applyChanges);

/**
 * @route   GET /api/schema
 * @desc    Get schema information
 * @access  Public
 */
router.get('/schema', mcpController.getSchema);

module.exports = router; 