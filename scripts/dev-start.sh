#!/bin/sh
# Starts the Srijan API and web dev server detached so they survive terminal cleanup.
set -e
ROOT="/Users/shivamkumar/Desktop/srijan-kimbal"

# Stop anything already on the ports.
lsof -ti:8080 | xargs kill 2>/dev/null || true
lsof -ti:3000 | xargs kill 2>/dev/null || true

# Fresh seed for the API.
rm -f "$ROOT/api/srijan.db"

cd "$ROOT/api"
nohup go run ./cmd/server > /tmp/srijan-api.log 2>&1 &
echo "api pid $!"

cd "$ROOT/web"
nohup pnpm dev > /tmp/srijan-web.log 2>&1 &
echo "web pid $!"
