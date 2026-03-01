import express from "express";
import cors from "cors";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import * as Sentry from "@sentry/node";
import { v4 as uuidv4 } from 'uuid';
import dbConfig from "./src/config/dbConfig.js";
import logger from "./src/config/logger.js";

// Security middleware
import securityHeaders from "./src/middleware/securityHeaders.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";
import requestLogger from "./src/middleware/requestLogger.js";
import errorHandler from "./src/middleware/errorHandler.js";

// Routes
import userRouter from './src/routes/userRouter.js';
import taskRouter from './src/routes/taskRouter.js';
import activityRouter from './src/routes/activityRouter.js';
import templateRouter from './src/routes/templateRouter.js';
import notificationRouter from './src/routes/notificationRouter.js';
import userReminderRouter from './src/routes/userReminderRouter.js';
import searchRouter from './src/routes/searchRouter.js';
import importExportRouter from './src/routes/importExportRouter.js';
import teamRouter from './src/routes/teamRouter.js';

const app = express();

// Initialize Sentry (must be before other middleware)
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
            // Enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // Enable Express.js middleware tracing
            new Sentry.Integrations.Express({ app }),
        ],
    });

    // Sentry request handler (must be first middleware)
    app.use(Sentry.Handlers.requestHandler());
    // Sentry tracing handler
    app.use(Sentry.Handlers.tracingHandler());

    logger.info('Sentry initialized');
}

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Request ID tracking
app.use((req, res, next) => {
    req.id = uuidv4();
    res.setHeader('X-Request-ID', req.id);
    next();
});

// Security headers (Helmet.js)
app.use(securityHeaders);

// Compression middleware
app.use(compression());

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN?.trim();
const corsOptions = {
    origin: corsOrigin === '*' ? true : (corsOrigin?.split(',').map(o => o.trim()) || [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'http://localhost:3000'
    ]),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
// Express 5: req.query is a read-only prototype getter — create a writable own-property first
app.use((req, _res, next) => {
    if (req.query) {
        Object.defineProperty(req, 'query', {
            value: Object.assign(Object.create(null), req.query),
            writable: true, configurable: true, enumerable: true,
        });
    }
    next();
});
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        logger.warn(`NoSQL injection attempt detected: ${key} from IP: ${req.ip}`);
    }
}));

// Request logging (Morgan + Winston)
app.use(requestLogger);

// Global rate limiting
app.use('/api', apiLimiter);

// Database connection
dbConfig();

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Task Manager API',
        version: 'v1',
        documentation: '/api',
        health: '/api/health'
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Task Manager API v1',
        version: 'v1',
        endpoints: {
            health: '/api/health',
            v1: '/api/v1',
            auth: '/api/v1/auth',
            tasks: '/api/v1/tasks',
            teams: '/api/v1/teams',
            notifications: '/api/v1/notifications',
            reminders: '/api/v1/reminders',
            templates: '/api/v1/templates',
            activity: '/api/v1/activity',
            search: '/api/v1/search'
        }
    });
});

// API v1 info endpoint
app.get('/api/v1', (req, res) => {
    res.json({
        success: true,
        version: 'v1',
        endpoints: [
            { path: '/api/v1/auth', methods: ['POST', 'GET'], description: 'Authentication & user management' },
            { path: '/api/v1/tasks', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Task management with subtasks, comments, attachments' },
            { path: '/api/v1/teams', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Team collaboration' },
            { path: '/api/v1/notifications', methods: ['GET', 'PUT', 'DELETE'], description: 'User notifications' },
            { path: '/api/v1/reminders', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Task reminders' },
            { path: '/api/v1/templates', methods: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Task templates' },
            { path: '/api/v1/activity', methods: ['GET'], description: 'Activity logs' },
            { path: '/api/v1/search', methods: ['GET', 'POST'], description: 'Advanced search' }
        ]
    });
});

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
    const { getDbHealth } = await import('./src/config/dbConfig.js');
    const dbHealth = await getDbHealth();

    const isHealthy = dbHealth.status === 'connected';

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbHealth,
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
        }
    });
});

// API Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/templates", templateRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/reminders", userReminderRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/tasks", importExportRouter); // Import/export routes for tasks

// 404 handler
app.use((req, res, next) => {
    logger.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Sentry error handler (must be before other error handlers)
if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
}

// Global error handler (must be last)
app.use(errorHandler);

// Log startup
logger.info(`App initialized in ${process.env.NODE_ENV || 'development'} mode`);

export default app;