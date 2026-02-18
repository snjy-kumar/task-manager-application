#!/bin/bash

# ================================================
# CRITICAL SECURITY FIX SCRIPT
# Run this BEFORE deploying to production
# ================================================

set -e  # Exit on error

echo "🔒 Task Manager Backend - Security Fix Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ================================================
# 1. Check if .env exists
# ================================================
if [ ! -f .env ]; then
    echo -e "${RED}❌ ERROR: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# ================================================
# 2. Generate secure JWT_SECRET
# ================================================
echo ""
echo "🔑 Generating secure JWT_SECRET..."

# Check if JWT_SECRET exists and is secure
CURRENT_SECRET=$(grep "^JWT_SECRET=" .env | cut -d '=' -f2)

if [ ${#CURRENT_SECRET} -lt 32 ]; then
    echo -e "${YELLOW}⚠️  Current JWT_SECRET is too short (${#CURRENT_SECRET} chars)${NC}"
    
    # Generate new secure secret
    NEW_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=${NEW_SECRET}|" .env
    else
        # Linux
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${NEW_SECRET}|" .env
    fi
    
    echo -e "${GREEN}✓ Generated new secure JWT_SECRET (64 characters)${NC}"
    echo "  Secret: ${NEW_SECRET:0:20}... (truncated for security)"
else
    echo -e "${GREEN}✓ JWT_SECRET is already secure (${#CURRENT_SECRET} chars)${NC}"
fi

# ================================================
# 3. Verify .env is in .gitignore
# ================================================
echo ""
echo "📝 Checking .gitignore..."

if ! grep -q "^\.env$" .gitignore; then
    echo ".env" >> .gitignore
    echo -e "${GREEN}✓ Added .env to .gitignore${NC}"
else
    echo -e "${GREEN}✓ .env is already in .gitignore${NC}"
fi

# ================================================
# 4. Check if .env is tracked in git
# ================================================
echo ""
echo "🔍 Checking git status..."

if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}❌ WARNING: .env file is tracked in git!${NC}"
    echo ""
    echo "Run these commands to remove it:"
    echo "  git rm --cached .env"
    echo "  git commit -m 'Remove .env file with sensitive credentials'"
    echo "  git push"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Rotate all credentials in .env after removing from git!${NC}"
else
    echo -e "${GREEN}✓ .env file is not tracked in git${NC}"
fi

# ================================================
# 5. Validate required environment variables
# ================================================
echo ""
echo "✅ Validating environment variables..."

REQUIRED_VARS=("NODE_ENV" "PORT" "MONGO_URI" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All required environment variables are present${NC}"
else
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
fi

# ================================================
# 6. Check for default values that need changing
# ================================================
echo ""
echo "🔎 Checking for default values..."

# Check MONGO_URI
if grep -q "localhost:27017" .env; then
    echo -e "${YELLOW}⚠️  MONGO_URI points to localhost (OK for development)${NC}"
    echo "   Change this for production deployment"
fi

# Check CORS_ORIGIN
if grep -q "localhost" .env | grep -q "CORS_ORIGIN"; then
    echo -e "${YELLOW}⚠️  CORS_ORIGIN includes localhost (OK for development)${NC}"
    echo "   Update this with your production domain"
fi

# ================================================
# 7. Run security audit
# ================================================
echo ""
echo "🔐 Running npm security audit..."
npm audit --audit-level=high

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ No high/critical vulnerabilities found${NC}"
else
    echo -e "${YELLOW}⚠️  Security vulnerabilities found. Run 'npm audit fix'${NC}"
fi

# ================================================
# 8. Test database connection
# ================================================
echo ""
echo "🗄️  Testing database connection..."

node -e "
import('mongoose').then(async (mongoose) => {
    try {
        await mongoose.default.connect(process.env.MONGO_URI);
        console.log('✓ Database connection successful');
        await mongoose.default.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
});
" || echo -e "${RED}❌ Database connection test failed${NC}"

# ================================================
# 9. Create production environment template
# ================================================
echo ""
echo "📋 Creating production environment template..."

cat > .env.production.example << 'EOF'
# ================================================
# PRODUCTION ENVIRONMENT VARIABLES
# ================================================
# DO NOT commit this file with actual values!
# Copy to your hosting platform's environment config
# ================================================

# Server Configuration
NODE_ENV=production
PORT=5000

# Database (MongoDB Atlas recommended)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration (MUST be cryptographically secure)
JWT_SECRET=<generate-with-openssl-rand-base64-48>
JWT_EXPIRATION=1d

# CORS (Your actual production domains)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info

# Error Tracking (Optional - Sentry)
SENTRY_DSN=

# Email Service (When implementing password reset)
SENDGRID_API_KEY=
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Rate Limiting (Optional - Redis for distributed systems)
REDIS_URL=redis://localhost:6379
EOF

echo -e "${GREEN}✓ Created .env.production.example${NC}"

# ================================================
# Summary
# ================================================
echo ""
echo "=============================================="
echo "📊 SECURITY FIX SUMMARY"
echo "=============================================="
echo ""
echo -e "${GREEN}✅ Completed Security Checks${NC}"
echo ""
echo "Next steps:"
echo "1. Review your .env file"
echo "2. If .env is in git, remove it and rotate credentials"
echo "3. Update MONGO_URI for production"
echo "4. Update CORS_ORIGIN with your production domain"
echo "5. Run 'npm test' to verify everything works"
echo "6. Follow DEPLOYMENT_CHECKLIST.md for deployment"
echo ""
echo -e "${YELLOW}⚠️  Never commit .env file to git!${NC}"
echo ""
