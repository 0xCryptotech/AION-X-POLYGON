#!/bin/bash

# AION-X Backend Deployment Script for VPS
# Usage: ./deploy-vps.sh <VPS_IP> <SSH_USER>

VPS_IP=$1
SSH_USER=$2

if [ -z "$VPS_IP" ] || [ -z "$SSH_USER" ]; then
    echo "Usage: ./deploy-vps.sh <VPS_IP> <SSH_USER>"
    echo "Example: ./deploy-vps.sh 192.168.1.100 root"
    exit 1
fi

echo "🚀 Deploying AION-X Backend to VPS..."

# Copy files to VPS
echo "📦 Copying files..."
scp -r ../backend ${SSH_USER}@${VPS_IP}:/root/aion-backend

# Install dependencies and setup PM2
echo "⚙️  Setting up on VPS..."
ssh ${SSH_USER}@${VPS_IP} << 'EOF'
cd /root/aion-backend

# Install Node.js if not exists
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
npm install

# Install PM2
npm install -g pm2

# Stop existing process
pm2 stop aion-backend || true
pm2 delete aion-backend || true

# Start backend with PM2
pm2 start autoResolve.js --name aion-backend

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup systemd -u root --hp /root

echo "✅ Backend deployed successfully!"
pm2 status
EOF

echo "🎉 Deployment complete!"
echo "Check status: ssh ${SSH_USER}@${VPS_IP} 'pm2 status'"
echo "View logs: ssh ${SSH_USER}@${VPS_IP} 'pm2 logs aion-backend'"
