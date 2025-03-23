const axios = require('axios');
const { logger } = require('../utils/logger');
const config = require('../config');

/**
 * CucumberStudio API Client
 * Based on the API documentation at https://studio-api.cucumberstudio.com
 */
class CucumberStudioClient {
  constructor() {
    this.baseURL = config.cucumberStudio.apiUrl;
    this.apiToken = config.cucumberStudio.apiToken;
    
    if (!this.apiToken) {
      logger.error('CucumberStudio API token is not set');
      throw new Error('CucumberStudio API token is required');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`
      }
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          logger.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          logger.error('No response received from API', error.request);
        } else {
          logger.error('Error setting up request', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get list of projects
   * @returns {Promise<Array>} List of projects
   */
  async getProjects() {
    try {
      const response = await this.axiosInstance.get('/projects');
      return response.data;
    } catch (error) {
      logger.error('Error fetching projects', error);
      throw error;
    }
  }

  /**
   * Get a specific project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project details
   */
  async getProject(projectId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Get features for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of features
   */
  async getFeatures(projectId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/features`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching features for project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Get a specific feature by ID
   * @param {string} projectId - Project ID
   * @param {string} featureId - Feature ID
   * @returns {Promise<Object>} Feature details
   */
  async getFeature(projectId, featureId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/features/${featureId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching feature ${featureId}`, error);
      throw error;
    }
  }

  /**
   * Get scenarios for a feature
   * @param {string} projectId - Project ID
   * @param {string} featureId - Feature ID
   * @returns {Promise<Array>} List of scenarios
   */
  async getScenarios(projectId, featureId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/features/${featureId}/scenarios`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching scenarios for feature ${featureId}`, error);
      throw error;
    }
  }

  /**
   * Get a specific scenario by ID
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @returns {Promise<Object>} Scenario details
   */
  async getScenario(projectId, scenarioId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/scenarios/${scenarioId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching scenario ${scenarioId}`, error);
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
      const response = await this.axiosInstance.post(`/projects/${projectId}/scenarios`, scenarioData);
      return response.data;
    } catch (error) {
      logger.error(`Error creating scenario in project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Update a scenario
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @param {Object} scenarioData - Scenario data to update
   * @returns {Promise<Object>} Updated scenario
   */
  async updateScenario(projectId, scenarioId, scenarioData) {
    try {
      const response = await this.axiosInstance.patch(`/projects/${projectId}/scenarios/${scenarioId}`, scenarioData);
      return response.data;
    } catch (error) {
      logger.error(`Error updating scenario ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Delete a scenario
   * @param {string} projectId - Project ID
   * @param {string} scenarioId - Scenario ID
   * @returns {Promise<Object>} Response
   */
  async deleteScenario(projectId, scenarioId) {
    try {
      const response = await this.axiosInstance.delete(`/projects/${projectId}/scenarios/${scenarioId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error deleting scenario ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Get folders for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of folders
   */
  async getFolders(projectId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/folders`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching folders for project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Get tags for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of tags
   */
  async getTags(projectId) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/tags`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching tags for project ${projectId}`, error);
      throw error;
    }
  }

  /**
   * Search for resources in a project
   * @param {string} projectId - Project ID
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} Search results
   */
  async search(projectId, searchParams) {
    try {
      const response = await this.axiosInstance.get(`/projects/${projectId}/search`, {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      logger.error(`Error searching in project ${projectId}`, error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new CucumberStudioClient(); 