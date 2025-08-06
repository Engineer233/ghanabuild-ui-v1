import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ghanabuild.AI API',
      version: '1.0.0',
      description: 'API for Ghana construction cost estimation platform',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js', './routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - region
 *         - projectType
 *         - totalFloorArea
 *         - numberOfBathrooms
 *         - numberOfFloors
 *       properties:
 *         region:
 *           type: string
 *           description: The region where the project is located
 *           example: "Greater Accra"
 *         projectType:
 *           type: string
 *           enum: [residential, commercial, industrial]
 *           description: Type of construction project
 *           example: "residential"
 *         totalFloorArea:
 *           type: number
 *           minimum: 500
 *           maximum: 10000
 *           description: Total floor area in square feet
 *           example: 2500
 *         numberOfBathrooms:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *           description: Number of bathrooms
 *           example: 3
 *         numberOfFloors:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Number of floors
 *           example: 2
 *         preferredFinishQuality:
 *           type: string
 *           enum: [basic, standard, premium, luxury]
 *           description: Quality level of finishes
 *           example: "standard"
 *         includeExternalWorks:
 *           type: boolean
 *           description: Whether to include external works in estimate
 *           example: false
 *     CostEstimate:
 *       type: object
 *       properties:
 *         totalCost:
 *           type: number
 *           description: Total estimated cost in USD
 *           example: 125000
 *         breakdown:
 *           type: object
 *           properties:
 *             foundation:
 *               type: number
 *               example: 15000
 *             structure:
 *               type: number
 *               example: 45000
 *             roofing:
 *               type: number
 *               example: 12000
 *             electrical:
 *               type: number
 *               example: 8000
 *             plumbing:
 *               type: number
 *               example: 10000
 *             finishes:
 *               type: number
 *               example: 25000
 *             externalWorks:
 *               type: number
 *               example: 10000
 *         details:
 *           type: string
 *           description: Additional details about the estimate
 *           example: "Estimate based on current market rates in Greater Accra region"
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "proj_123"
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data
 */

// Sample projects storage (in production, use a proper database)
let projects = [];
let projectIdCounter = 1;

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  try {
    const { region, projectType, totalFloorArea, numberOfBathrooms, numberOfFloors, preferredFinishQuality, includeExternalWorks } = req.body;
    
    // Basic validation
    if (!region || !projectType || !totalFloorArea || !numberOfBathrooms || !numberOfFloors) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = {
      id: `proj_${projectIdCounter++}`,
      region,
      projectType,
      totalFloorArea: Number(totalFloorArea),
      numberOfBathrooms: Number(numberOfBathrooms),
      numberOfFloors: Number(numberOfFloors),
      preferredFinishQuality: preferredFinishQuality || 'standard',
      includeExternalWorks: Boolean(includeExternalWorks),
      createdAt: new Date().toISOString()
    };

    projects.push(project);
    res.status(201).json({ id: project.id, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/estimate:
 *   post:
 *     summary: Calculate cost estimate for a project
 *     tags: [Estimates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Cost estimate calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostEstimate'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
app.post('/api/estimate', (req, res) => {
  try {
    const { region, projectType, totalFloorArea, numberOfBathrooms, numberOfFloors, preferredFinishQuality, includeExternalWorks } = req.body;
    
    // Basic validation
    if (!region || !projectType || !totalFloorArea || !numberOfBathrooms || !numberOfFloors) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Regional cost multipliers (mock data)
    const regionalMultipliers = {
      'greater accra': 1.2,
      'ashanti': 1.0,
      'western': 0.9,
      'eastern': 0.85,
      'northern': 0.75,
      'default': 1.0
    };

    // Project type multipliers
    const typeMultipliers = {
      residential: 1.0,
      commercial: 1.3,
      industrial: 1.5
    };

    // Quality multipliers
    const qualityMultipliers = {
      basic: 0.8,
      standard: 1.0,
      premium: 1.3,
      luxury: 1.8
    };

    // Base cost per square foot (in USD)
    const baseCostPerSqFt = 50;

    const regionKey = region.toLowerCase();
    const regionMultiplier = regionalMultipliers[regionKey] || regionalMultipliers.default;
    const typeMultiplier = typeMultipliers[projectType] || 1.0;
    const qualityMultiplier = qualityMultipliers[preferredFinishQuality] || 1.0;

    // Calculate base cost
    const baseCost = totalFloorArea * baseCostPerSqFt * regionMultiplier * typeMultiplier * qualityMultiplier;

    // Calculate breakdown
    const breakdown = {
      foundation: Math.round(baseCost * 0.12),
      structure: Math.round(baseCost * 0.36),
      roofing: Math.round(baseCost * 0.10),
      electrical: Math.round(baseCost * 0.08),
      plumbing: Math.round(baseCost * 0.10),
      finishes: Math.round(baseCost * 0.20),
    };

    // Add external works if requested
    if (includeExternalWorks) {
      breakdown.externalWorks = Math.round(baseCost * 0.08);
    }

    const totalCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);

    const estimate = {
      totalCost,
      breakdown,
      details: `Estimate based on current market rates in ${region} region for ${preferredFinishQuality} quality ${projectType} construction.`,
      currency: 'USD',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      estimatedAt: new Date().toISOString()
    };

    res.json(estimate);
  } catch (error) {
    console.error('Error calculating estimate:', error);
    res.status(500).json({ error: 'Failed to calculate estimate' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api/docs`);
});

export default app;