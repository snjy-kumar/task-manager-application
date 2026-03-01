#!/bin/bash
# Hook: blocks writes to .env files (secrets) — .env.example files are allowed.
# Fires before every Write tool use.

FILE=$(node -pe "JSON.parse(process.env.CLAUDE_TOOL_INPUT||'{}').file_path||''" 2>/dev/null)

# Block writes to any path ending in /.env (literal filename, not .env.example etc.)
if [[ "$FILE" =~ /\.env$ ]]; then
  echo "ERROR: Refusing to write to $FILE" >&2
  echo "  .env files contain secrets. Commit .env.example for templates instead." >&2
  exit 2  # Exit code 2 = block the tool call
fi
