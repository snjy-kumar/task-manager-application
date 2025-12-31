import morgan from 'morgan';
import logger from '../config/logger.js';

// Custom token for response time with color
morgan.token('response-time-colored', (req, res) => {
    const time = morgan['response-time'](req, res);
    if (!time) return '-';
    const ms = parseFloat(time);
    if (ms < 100) return `${time}ms`;
    if (ms < 500) return `${time}ms`;
    return `${time}ms`;
});

// Custom token for status code
morgan.token('status-colored', (req, res) => {
    const status = res.statusCode;
    return status;
});

// Development format - colorful and detailed
const devFormat = ':method :url :status-colored :response-time-colored - :res[content-length]';

// Production format - JSON structured
const prodFormat = JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time ms',
    contentLength: ':res[content-length]',
    userAgent: ':user-agent',
    ip: ':remote-addr',
});

// Skip logging for health checks and static assets
const skip = (req, res) => {
    const skipPaths = ['/api/health', '/favicon.ico'];
    return skipPaths.some(path => req.originalUrl.includes(path));
};

// Create Morgan middleware based on environment
const requestLogger = process.env.NODE_ENV === 'production'
    ? morgan(prodFormat, {
        stream: logger.stream,
        skip,
    })
    : morgan(devFormat, {
        stream: logger.stream,
        skip,
    });

export default requestLogger;
