const mcpService = require('../mcpService');

// Mock the CucumberStudio client
jest.mock('../cucumberStudioClient', () => ({
  getProjects: jest.fn(),
  getProject: jest.fn(),
  getFeatures: jest.fn(),
  getFeature: jest.fn(),
  getScenarios: jest.fn(),
  getScenario: jest.fn(),
  getFolders: jest.fn(),
  getTags: jest.fn(),
  createScenario: jest.fn(),
  updateScenario: jest.fn(),
  deleteScenario: jest.fn()
}));

const cucumberStudioClient = require('../cucumberStudioClient');

describe('MCPService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getContext', () => {
    it('should throw an error if type is not provided', async () => {
      await expect(mcpService.getContext({})).rejects.toThrow('Query type is required');
    });

    it('should throw an error if projectId is not provided for project type', async () => {
      await expect(mcpService.getContext({ type: 'project' })).rejects.toThrow('Project ID is required for project context');
    });

    it('should fetch projects context', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      cucumberStudioClient.getProjects.mockResolvedValue(mockProjects);

      const result = await mcpService.getContext({ type: 'projects' });

      expect(cucumberStudioClient.getProjects).toHaveBeenCalled();
      expect(result.type).toBe('projects');
      expect(result.data).toEqual(mockProjects);
      expect(result.metadata.count).toBe(1);
    });
  });

  describe('applyChanges', () => {
    it('should throw an error if type is not provided', async () => {
      await expect(mcpService.applyChanges({})).rejects.toThrow('Type, project ID, and data are required');
    });

    it('should throw an error for unsupported change type', async () => {
      await expect(mcpService.applyChanges({ type: 'unsupported', projectId: '1', data: {} }))
        .rejects.toThrow('Unsupported change type: unsupported');
    });

    it('should create a scenario', async () => {
      const mockScenarioData = { name: 'Test Scenario', featureId: '1' };
      const mockCreatedScenario = { id: '1', ...mockScenarioData };
      
      cucumberStudioClient.createScenario.mockResolvedValue(mockCreatedScenario);

      const result = await mcpService.applyChanges({
        type: 'createScenario',
        projectId: '1',
        data: mockScenarioData
      });

      expect(cucumberStudioClient.createScenario).toHaveBeenCalledWith('1', mockScenarioData);
      expect(result.type).toBe('createScenario');
      expect(result.data).toEqual(mockCreatedScenario);
    });
  });

  describe('getSchema', () => {
    it('should return the schema information', () => {
      const schema = mcpService.getSchema();
      
      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('version');
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('contextTypes');
      expect(schema).toHaveProperty('changeTypes');
    });
  });
}); 