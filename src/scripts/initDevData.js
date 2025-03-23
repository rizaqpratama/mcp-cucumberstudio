#!/usr/bin/env node

/**
 * This script is used to initialize the server with sample data for development
 * It should NOT be used in production
 */

const dotenv = require('dotenv');
dotenv.config();

const config = require('../config');
const cucumberStudioClient = require('../services/cucumberStudioClient');
const { logger } = require('../utils/logger');

// Check if we're in development
if (config.env !== 'development') {
  logger.error('This script should only be run in development mode');
  process.exit(1);
}

// Sample project data
const sampleProject = {
  name: 'Sample MCP Project',
  description: 'This is a sample project for MCP development'
};

// Sample feature data
const sampleFeature = {
  name: 'Sample Feature',
  description: 'This is a sample feature for MCP development'
};

// Sample scenario data
const sampleScenario = {
  name: 'Sample Scenario',
  description: 'This is a sample scenario for MCP development',
  language: 'en',
  steps: [
    {
      keyword: 'Given',
      value: 'I have initialized the MCP server'
    },
    {
      keyword: 'When',
      value: 'I make an API request'
    },
    {
      keyword: 'Then',
      value: 'I should get the expected response'
    }
  ]
};

/**
 * Initialize development data
 */
async function initDevData() {
  try {
    logger.info('Initializing development data...');

    // Check API connection
    logger.info('Checking API connection...');
    const projects = await cucumberStudioClient.getProjects();
    logger.info(`Found ${projects.length} projects`);

    // Log success
    logger.info('API connection successful');
    logger.info('Development data initialization completed');
    
    // Output sample request commands
    logger.info('\nSample cURL commands:');
    logger.info('Get projects:');
    logger.info('curl -X GET "http://localhost:3000/api/context?type=projects" -H "Content-Type: application/json"');
    
    logger.info('\nGet project:');
    logger.info('curl -X GET "http://localhost:3000/api/context?type=project&projectId=YOUR_PROJECT_ID" -H "Content-Type: application/json"');
    
    logger.info('\nGet schema:');
    logger.info('curl -X GET "http://localhost:3000/api/schema" -H "Content-Type: application/json"');
    
  } catch (error) {
    logger.error('Error initializing development data', error);
    process.exit(1);
  }
}

// Execute the initialization
initDevData(); 