const mcpService = require('../services/mcpService');
const { logger } = require('../utils/logger');

/**
 * Get context from CucumberStudio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getContext = async (req, res, next) => {
  try {
    logger.info('Received context request');
    const context = await mcpService.getContext(req.query);
    res.json(context);
  } catch (error) {
    logger.error(`Error in getContext: ${error.message}`);
    next(error);
  }
};

/**
 * Apply changes to CucumberStudio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const applyChanges = async (req, res, next) => {
  try {
    logger.info('Received apply changes request');
    const result = await mcpService.applyChanges(req.body);
    res.json(result);
  } catch (error) {
    logger.error(`Error in applyChanges: ${error.message}`);
    next(error);
  }
};

/**
 * Get schema information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSchema = (req, res) => {
  logger.info('Received schema request');
  const schema = mcpService.getSchema();
  res.json(schema);
};

module.exports = {
  getContext,
  applyChanges,
  getSchema
}; 