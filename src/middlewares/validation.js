const Joi = require('joi');
const { logger } = require('../utils/logger');

/**
 * Validates request data against a schema
 * @param {Object} schema - Joi schema for validation
 * @returns {Function} Middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Determine what part of the request to validate
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    
    const { error } = schema.validate(dataToValidate, { abortEarly: false });
    
    if (error) {
      logger.error(`Validation error: ${error.message}`);
      
      const errorDetails = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path
      }));
      
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errorDetails
        }
      });
    }
    
    next();
  };
};

// Schema for context requests
const contextSchema = Joi.object({
  type: Joi.string().required().valid(
    'projects',
    'project',
    'features',
    'feature',
    'scenarios',
    'scenario'
  ),
  projectId: Joi.string().when('type', {
    is: Joi.string().valid('project', 'features', 'feature', 'scenarios', 'scenario'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  featureId: Joi.string().when('type', {
    is: Joi.string().valid('feature', 'scenarios'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  scenarioId: Joi.string().when('type', {
    is: 'scenario',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Schema for apply changes requests
const applyChangesSchema = Joi.object({
  type: Joi.string().required().valid(
    'createScenario',
    'updateScenario',
    'deleteScenario'
  ),
  projectId: Joi.string().required(),
  data: Joi.object().required().when('type', {
    switch: [
      {
        is: 'createScenario',
        then: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().allow(''),
          featureId: Joi.string().required(),
          folderIds: Joi.array().items(Joi.string()),
          tagIds: Joi.array().items(Joi.string()),
          language: Joi.string(),
          steps: Joi.array().items(Joi.object())
        })
      },
      {
        is: 'updateScenario',
        then: Joi.object({
          id: Joi.string().required(),
          name: Joi.string(),
          description: Joi.string().allow(''),
          featureId: Joi.string(),
          folderIds: Joi.array().items(Joi.string()),
          tagIds: Joi.array().items(Joi.string()),
          language: Joi.string(),
          steps: Joi.array().items(Joi.object())
        })
      },
      {
        is: 'deleteScenario',
        then: Joi.object({
          id: Joi.string().required()
        })
      }
    ]
  })
});

module.exports = {
  validateContext: validateRequest(contextSchema),
  validateApplyChanges: validateRequest(applyChangesSchema)
}; 