#!/bin/bash
cd "$(dirname "$0")"
pkill -f "ts-node-dev" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "mock_ai.py" 2>/dev/null
sleep 2
cd backend && npm run dev > backend.log 2>&1 &
cd ../frontend && npm run dev > frontend.log 2>&1 &
cd ../ai_agent && python3 mock_ai.py > ai.log 2>&1 &
sleep 5
open http://localhost:5173
echo "✅ App running: http://localhost:5173"
