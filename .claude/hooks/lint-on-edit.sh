#!/bin/bash
# Hook: runs ESLint on TypeScript files edited in frontend/src.
# Fires after every Edit or Write tool use.

FILE=$(node -pe "JSON.parse(process.env.CLAUDE_TOOL_INPUT||'{}').file_path||''" 2>/dev/null)

# Only act on frontend src TypeScript files
[[ "$FILE" != *"/frontend/src/"* ]] && exit 0
[[ "$FILE" != *.ts && "$FILE" != *.tsx ]] && exit 0

FRONTEND_DIR="/home/sanjay/projects/task-manager-application/frontend"
cd "$FRONTEND_DIR" || exit 0

npx eslint "$FILE" --max-warnings 0 2>&1
