import helmet from 'helmet';

/**
 * Security headers configuration using Helmet.js
 * Provides protection against common web vulnerabilities
 */
const securityHeaders = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    // Cross-Origin policies
    crossOriginEmbedderPolicy: false, // Disabled for API compatibility
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },
    // Clickjacking protection
    frameguard: { action: 'deny' },
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // HTTP Strict Transport Security
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    // Prevent IE from opening files
    ieNoOpen: true,
    // Prevent MIME type sniffing
    noSniff: true,
    // Origin-Agent-Cluster header
    originAgentCluster: true,
    // Permitted Cross-Domain Policies
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    // Referrer Policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // XSS Filter (legacy)
    xssFilter: true
});

export default securityHeaders;
