/** @type {import('jest').Config} */
export default {
    // Use ES modules
    transform: {},

    // Test environment
    testEnvironment: 'node',

    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/**',
        '!**/node_modules/**'
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },

    // Setup files
    setupFilesAfterEnv: ['./tests/setup.js'],

    // Verbose output
    verbose: true,

    // Force exit after tests complete
    forceExit: true,

    // Clear mocks between tests
    clearMocks: true,

    // Timeout
    testTimeout: 10000
};
