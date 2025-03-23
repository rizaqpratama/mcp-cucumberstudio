const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // CucumberStudio API configuration
  cucumberStudio: {
    apiUrl: process.env.CUCUMBER_STUDIO_API_URL || 'https://studio-api.cucumberstudio.com/api/v2',
    apiToken: process.env.CUCUMBER_STUDIO_API_TOKEN
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

// Validation
if (!config.cucumberStudio.apiToken && config.env === 'production') {
  throw new Error('CucumberStudio API token is required in production');
}

module.exports = config; 