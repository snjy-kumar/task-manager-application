#!/bin/bash

# ================================================
# Pre-Deployment Validation Script
# Run this before deploying to catch issues early
# ================================================

set -e

echo "🔍 Pre-Deployment Validation"
echo "=============================="
echo ""

FAILED_CHECKS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print check status
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ================================================
# 1. Environment Checks
# ================================================
echo "📋 Environment Configuration"
echo "----------------------------"

# Check .env file
if [ -f .env ]; then
    check_pass ".env file exists"
    
    # Check required variables
    if grep -q "^JWT_SECRET=.\\{32,\\}" .env; then
        check_pass "JWT_SECRET is secure (32+ characters)"
    else
        check_fail "JWT_SECRET is too short or missing"
    fi
    
    if grep -q "^MONGO_URI=" .env; then
        check_pass "MONGO_URI is configured"
    else
        check_fail "MONGO_URI is missing"
    fi
    
    if grep -q "^NODE_ENV=production" .env; then
        check_warn "NODE_ENV is set to production in .env (should be set in hosting platform)"
    fi
else
    check_fail ".env file not found"
fi

# Check .env not in git
if git ls-files --error-unmatch .env 2>/dev/null; then
    check_fail ".env file is tracked in git (SECURITY RISK!)"
else
    check_pass ".env is not tracked in git"
fi

echo ""

# ================================================
# 2. Dependency Checks
# ================================================
echo "📦 Dependencies"
echo "---------------"

# Check node_modules
if [ -d node_modules ]; then
    check_pass "node_modules directory exists"
else
    check_fail "node_modules not found. Run 'npm install'"
fi

# Check for vulnerabilities
echo "  Running npm audit..."
if npm audit --audit-level=high --production > /dev/null 2>&1; then
    check_pass "No high/critical vulnerabilities"
else
    check_fail "Security vulnerabilities found. Run 'npm audit fix'"
fi

# Check package-lock.json
if [ -f package-lock.json ]; then
    check_pass "package-lock.json exists"
else
    check_warn "package-lock.json missing (run 'npm install')"
fi

echo ""

# ================================================
# 3. Code Quality Checks
# ================================================
echo "🔧 Code Quality"
echo "---------------"

# Check for console.log (should use logger)
if grep -r "console\.log" src/ --exclude-dir=node_modules --exclude="*.test.js" > /dev/null 2>&1; then
    check_warn "console.log found in code (use logger instead)"
else
    check_pass "No console.log in production code"
fi

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO" src/ --exclude-dir=node_modules | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
    check_warn "$TODO_COUNT TODO comments found in code"
else
    check_pass "No TODO comments"
fi

echo ""

# ================================================
# 4. Test Coverage
# ================================================
echo "🧪 Tests"
echo "--------"

if [ -d tests ]; then
    check_pass "Test directory exists"
    
    # Run tests
    echo "  Running tests..."
    if npm test > /dev/null 2>&1; then
        check_pass "All tests passing"
    else
        check_fail "Tests failed. Fix before deploying!"
    fi
else
    check_warn "No tests directory found"
fi

echo ""

# ================================================
# 5. Docker Checks
# ================================================
echo "🐳 Docker"
echo "---------"

if [ -f Dockerfile ]; then
    check_pass "Dockerfile exists"
    
    # Try to build
    echo "  Testing Docker build..."
    if docker build -t taskmanager-api-test . > /dev/null 2>&1; then
        check_pass "Docker build successful"
        docker rmi taskmanager-api-test > /dev/null 2>&1
    else
        check_fail "Docker build failed"
    fi
else
    check_fail "Dockerfile not found"
fi

if [ -f .dockerignore ]; then
    check_pass ".dockerignore exists"
else
    check_warn ".dockerignore missing (creates larger images)"
fi

echo ""

# ================================================
# 6. Security Configuration
# ================================================
echo "🔒 Security"
echo "-----------"

# Check Helmet.js
if grep -q "helmet" app.js; then
    check_pass "Helmet.js security headers configured"
else
    check_warn "Helmet.js not found"
fi

# Check rate limiting
if grep -q "rate-limit" app.js; then
    check_pass "Rate limiting configured"
else
    check_warn "Rate limiting not configured"
fi

# Check CORS
if grep -q "cors" app.js; then
    check_pass "CORS configured"
else
    check_fail "CORS not configured"
fi

# Check input sanitization
if grep -q "mongo-sanitize" app.js; then
    check_pass "NoSQL injection protection enabled"
else
    check_warn "NoSQL injection protection not found"
fi

echo ""

# ================================================
# 7. Database Checks
# ================================================
echo "🗄️  Database"
echo "-----------"

# Test connection
echo "  Testing database connection..."
node -e "
import('mongoose').then(async (mongoose) => {
    try {
        await mongoose.default.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✓ Database connection successful');
        await mongoose.default.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        process.exit(1);
    }
});
" && check_pass "Database connection verified" || check_fail "Cannot connect to database"

echo ""

# ================================================
# 8. Production Readiness
# ================================================
echo "🚀 Production Readiness"
echo "----------------------"

# Check for development dependencies
if grep -q "nodemon" package.json; then
    if grep -q "\"nodemon\"" package.json | grep -q "devDependencies"; then
        check_pass "Development dependencies properly separated"
    else
        check_warn "nodemon should be in devDependencies"
    fi
fi

# Check start script
if grep -q "\"start\": \"node server.js\"" package.json; then
    check_pass "Production start script configured"
else
    check_warn "Start script may not be production-ready"
fi

# Check health endpoint
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    check_pass "Health endpoint responding"
else
    check_warn "Health endpoint not responding (is server running?)"
fi

echo ""

# ================================================
# 9. Documentation
# ================================================
echo "📚 Documentation"
echo "----------------"

[ -f README.md ] && check_pass "README.md exists" || check_warn "README.md missing"
[ -f .env.example ] && check_pass ".env.example exists" || check_fail ".env.example missing"
[ -f DEPLOYMENT_CHECKLIST.md ] && check_pass "Deployment checklist exists" || check_warn "No deployment checklist"

echo ""

# ================================================
# Summary
# ================================================
echo "=============================="
echo "📊 VALIDATION SUMMARY"
echo "=============================="
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "Your backend is ready for deployment."
    echo "Review DEPLOYMENT_CHECKLIST.md for final steps."
    exit 0
else
    echo -e "${RED}❌ $FAILED_CHECKS critical check(s) failed${NC}"
    echo ""
    echo "Fix the issues above before deploying."
    echo "Run './scripts/security-fix.sh' to fix common issues."
    exit 1
fi
