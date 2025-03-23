# CucumberStudio MCP Server

This project implements a Model Context Protocol (MCP) server for CucumberStudio API. It provides context from the CucumberStudio platform to AI-powered applications, enabling various AI operations to be performed with CucumberStudio data.

## Overview

The Model Context Protocol server enables AI assistants to:

1. Fetch data from CucumberStudio API
2. Provide context about CucumberStudio projects, features, scenarios, and other resources
3. Enable AI to generate and modify test scenarios, features, and other CucumberStudio resources

## Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- CucumberStudio API token

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   CUCUMBER_STUDIO_API_TOKEN=your_api_token_here
   PORT=3000
   ```

### Running the Server

To start the server:

```
npm start
```

or

```
yarn start
```

## API Endpoints

The MCP server exposes the following endpoints:

- `GET /context`: Fetch context from CucumberStudio
- `POST /apply`: Apply changes to CucumberStudio resources
- `GET /schema`: Get the schema for the MCP server

## Implementation Details

This MCP server follows the Model Context Protocol specification and integrates with the CucumberStudio API available at https://studio-api.cucumberstudio.com/.

## License

MIT 