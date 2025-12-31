import helmet from 'helmet';

/**
 * Security headers for API backend
 * Simplified - no CSP needed for JSON-only API
 */
const securityHeaders = helmet({
    // Disable CSP for API-only backend (no HTML served)
    contentSecurityPolicy: false,
    // Hide X-Powered-By
    hidePoweredBy: true,
    // HSTS for production
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
    },
    // Prevent MIME sniffing
    noSniff: true,
    // XSS filter
    xssFilter: true,
});

export default securityHeaders;
