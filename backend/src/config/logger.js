import winston from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

// Simple console format for development
const devFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message }) =>
        `${timestamp} [${level}]: ${typeof message === 'object' ? JSON.stringify(message) : message}`
    )
);

// JSON format for production
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

const logger = winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: isDev ? devFormat : prodFormat,
    transports: [
        new winston.transports.Console(),
        // Add file transport in production
        ...(isDev ? [] : [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ])
    ],
});

export default logger;
