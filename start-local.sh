#!/bin/bash

echo "🚀 Starting AION-X Local Development..."

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend
echo "🔧 Starting backend on port 4000..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ AION-X is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
