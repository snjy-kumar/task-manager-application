import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
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

// Security headers (Helmet.js)
app.use(securityHeaders);

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (Morgan + Winston)
app.use(requestLogger);

// Global rate limiting
app.use('/api', apiLimiter);

// Database connection
dbConfig();

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