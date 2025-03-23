const cucumberStudioClient = require('./cucumberStudioClient');
const { logger } = require('../utils/logger');

/**
 * MCP Service
 * Handles operations for the Model Context Protocol
 */
class MCPService {
  /**
   * Get context based on query
   * @param {Object} query - The context query
   * @returns {Promise<Object>} Context data
   */
  async getContext(query) {
    logger.info(`Getting context with query: ${JSON.stringify(query)}`);
    
    try {
      const { projectId, featureId, scenarioId, type } = query;

      // Validate required parameters based on type
      if (!type) {
        throw new Error('Query type is required');
      }

      // Handle different query types
      switch (type) {
        case 'projects':
          return await this.getProjectsContext();
          
        case 'project':
          if (!projectId) {
            throw new Error('Project ID is required for project context');
          }
          return await this.getProjectContext(projectId);
          
        case 'features':
          if (!projectId) {
            throw new Error('Project ID is required for features context');
          }
          return await this.getFeaturesContext(projectId);
          
        case 'feature':
          if (!projectId || !featureId) {
            throw new Error('Project ID and Feature ID are required for feature context');
          }
          return await this.getFeatureContext(projectId, featureId);
          
        case 'scenarios':
          if (!projectId || !featureId) {
            throw new Error('Project ID and Feature ID are required for scenarios context');
          }
          return await this.getScenariosContext(projectId, featureId);
          
        case 'scenario':
          if (!projectId || !scenarioId) {
            throw new Error('Project ID and Scenario ID are required for scenario context');
          }
          return await this.getScenarioContext(projectId, scenarioId);
          
        default:
          throw new Error(`Unsupported context type: ${type}`);
      }
    } catch (error) {
      logger.error(`Error getting context: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get context about all projects
   * @returns {Promise<Object>} Projects context
   */
  async getProjectsContext() {
    try {
      const projects = await cucumberStudioClient.getProjects();
      
      return {
        type: 'projects',
        data: projects,
        metadata: {
          count: projects.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error getting projects context', error);
      throw error;
    }
  }

  /**
   * Get context about a specific project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project context
   */
  async getProjectContext(projectId) {
    try {
      const project = await cucumberStudioClient.getProject(projectId);
      const features = await cucumberStudioClient.getFeatures(projectId);
      const folders = await cucumberStudioClient.getFolders(projectId);
      const tags = await cucumberStudioClient.getTags(projectId);
      
      return {
        type: 'project',
        data: {
          project,
          features: {
            count: features.length,
            items: features.map(f => ({
              id: f.id,
              name: f.name,
              description: f.description
            }))
          },
          folders: {
            count: folders.length,
            items: folders
          },
          tags: {
            count: tags.length,
            items: tags
          }
        },
        metadata: {
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting project context for ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Get context about features in a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Features context
   */
  async getFeaturesContext(projectId) {
    try {
      const features = await cucumberStudioClient.getFeatures(projectId);
      
      return {
        type: 'features',
        data: features,
        metadata: {
          projectId,
          count: features.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting features context for project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Get context about a specific feature
   * @param {string} projectId - Project ID
   * @param {string} featureId - Feature ID
   * @returns {Promise<Object>} Feature context
   */
  async getFeatureContext(projectId, featureId) {
    try {
      const feature = await cucumberStudioClient.getFeature(projectId, featureId);
      const scenarios = await cucumberStudioClient.getScenarios(projectId, featureId);
      
      return {
        type: 'feature',
        data: {
          feature,
          scenarios: {
            count: scenarios.length,
            items: scenarios
          }
        },
        metadata: {
          projectId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting feature context for ${featureId}`, error);
      throw error;
    }
  }

  /**
   * Get context about scenarios in a feature
   * @param {string} projectId - Project ID
   * @param {string} featureId - Feature ID
   * @returns {Promise<Object>} Scenarios context
   */
  async getScenariosContext(projectId, featureId) {
    try {
      const scenarios = await cucumberStudioClient.getScenarios(projectId, featureId);
      
      return {
        type: 'scenarios',
        data: scenarios,
        metadata: {
          projectId,
          featureId,
          count: scenarios.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting scenarios context for feature ${featureId}`, error);
      throw error;
    }
  }

  /**
   * Get context about a specific scenario
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @returns {Promise<Object>} Scenario context
   */
  async getScenarioContext(projectId, scenarioId) {
    try {
      const scenario = await cucumberStudioClient.getScenario(projectId, scenarioId);
      
      return {
        type: 'scenario',
        data: scenario,
        metadata: {
          projectId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting scenario context for ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Apply changes to CucumberStudio resources
   * @param {Object} changes - Changes to apply
   * @returns {Promise<Object>} Result of applying changes
   */
  async applyChanges(changes) {
    logger.info(`Applying changes: ${JSON.stringify(changes)}`);
    
    try {
      const { type, projectId, data } = changes;

      if (!type || !projectId || !data) {
        throw new Error('Type, project ID, and data are required');
      }

      // Handle different change types
      switch (type) {
        case 'createScenario':
          return await this.createScenario(projectId, data);
          
        case 'updateScenario':
          if (!data.id) {
            throw new Error('Scenario ID is required for scenario update');
          }
          return await this.updateScenario(projectId, data.id, data);
          
        case 'deleteScenario':
          if (!data.id) {
            throw new Error('Scenario ID is required for scenario deletion');
          }
          return await this.deleteScenario(projectId, data.id);
          
        default:
          throw new Error(`Unsupported change type: ${type}`);
      }
    } catch (error) {
      logger.error(`Error applying changes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new scenario
   * @param {string} projectId - Project ID
   * @param {Object} scenarioData - Scenario data
   * @returns {Promise<Object>} Created scenario
   */
  async createScenario(projectId, scenarioData) {
    try {
      const scenario = await cucumberStudioClient.createScenario(projectId, scenarioData);
      
      return {
        type: 'createScenario',
        data: scenario,
        metadata: {
          projectId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error creating scenario in project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Update a scenario
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @param {Object} scenarioData - Scenario data
   * @returns {Promise<Object>} Updated scenario
   */
  async updateScenario(projectId, scenarioId, scenarioData) {
    try {
      const scenario = await cucumberStudioClient.updateScenario(projectId, scenarioId, scenarioData);
      
      return {
        type: 'updateScenario',
        data: scenario,
        metadata: {
          projectId,
          scenarioId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error updating scenario ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Delete a scenario
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @returns {Promise<Object>} Result of deletion
   */
  async deleteScenario(projectId, scenarioId) {
    try {
      await cucumberStudioClient.deleteScenario(projectId, scenarioId);
      
      return {
        type: 'deleteScenario',
        data: { id: scenarioId, deleted: true },
        metadata: {
          projectId,
          scenarioId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error deleting scenario ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Get schema information for the MCP server
   * @returns {Object} Schema information
   */
  getSchema() {
    return {
      name: 'CucumberStudio MCP Server',
      version: '1.0.0',
      description: 'Model Context Protocol server for CucumberStudio API',
      contextTypes: [
        {
          type: 'projects',
          description: 'Get information about all projects',
          parameters: {}
        },
        {
          type: 'project',
          description: 'Get information about a specific project, including its features, folders, and tags',
          parameters: {
            projectId: 'string'
          }
        },
        {
          type: 'features',
          description: 'Get information about all features in a project',
          parameters: {
            projectId: 'string'
          }
        },
        {
          type: 'feature',
          description: 'Get information about a specific feature, including its scenarios',
          parameters: {
            projectId: 'string',
            featureId: 'string'
          }
        },
        {
          type: 'scenarios',
          description: 'Get information about all scenarios in a feature',
          parameters: {
            projectId: 'string',
            featureId: 'string'
          }
        },
        {
          type: 'scenario',
          description: 'Get information about a specific scenario',
          parameters: {
            projectId: 'string',
            scenarioId: 'string'
          }
        }
      ],
      changeTypes: [
        {
          type: 'createScenario',
          description: 'Create a new scenario',
          parameters: {
            projectId: 'string',
            data: {
              name: 'string',
              description: 'string',
              featureId: 'string',
              folderIds: 'string[]',
              tagIds: 'string[]',
              language: 'string',
              steps: 'object[]'
            }
          }
        },
        {
          type: 'updateScenario',
          description: 'Update an existing scenario',
          parameters: {
            projectId: 'string',
            data: {
              id: 'string',
              name: 'string',
              description: 'string',
              featureId: 'string',
              folderIds: 'string[]',
              tagIds: 'string[]',
              language: 'string',
              steps: 'object[]'
            }
          }
        },
        {
          type: 'deleteScenario',
          description: 'Delete a scenario',
          parameters: {
            projectId: 'string',
            data: {
              id: 'string'
            }
          }
        }
      ]
    };
  }
}

// Export a singleton instance
module.exports = new MCPService(); 