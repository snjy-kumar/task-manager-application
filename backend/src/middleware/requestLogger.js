import morgan from 'morgan';
import logger from '../config/logger.js';

// Skip logging for health checks
const skip = (req) => req.originalUrl.includes('/api/health');

// Simple format: method url status response-time
const format = ':method :url :status :response-time ms';

// Morgan middleware with Winston integration
const requestLogger = morgan(format, {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip,
});

export default requestLogger;
