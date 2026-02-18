// PM2 Ecosystem Configuration for Production
// Usage: pm2 start ecosystem.config.cjs --env production

module.exports = {
  apps: [{
    name: 'taskmanager-api',
    script: 'server.js',
    
    // Instance configuration
    instances: process.env.PM2_INSTANCES || 'max',  // Use all CPU cores
    exec_mode: 'cluster',  // Enable cluster mode for load balancing
    
    // Restart configuration
    autorestart: true,
    watch: false,  // Disable in production
    max_memory_restart: '500M',  // Restart if memory exceeds 500MB
    
    // Logging
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    combine_logs: true,
    
    // Environment variables
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000,
      watch: true
    },
    
    // Advanced configuration
    min_uptime: '10s',  // Min uptime before considered online
    max_restarts: 10,   // Max restarts within 1 minute
    
    // Graceful shutdown
    kill_timeout: 5000,  // Time to wait before force killing (ms)
    wait_ready: true,    // Wait for process.send('ready')
    listen_timeout: 3000, // Time to wait for listen event
    
    // Source map support
    source_map_support: true,
    
    // Monitoring
    merge_logs: true,
    
    // Process management
    cron_restart: '0 3 * * *',  // Restart at 3 AM daily (optional)
    
    // Node.js arguments
    node_args: '--max-old-space-size=512'
  }]
};
