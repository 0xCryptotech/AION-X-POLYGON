#!/bin/bash

echo "=========================================="
echo "Force Refresh Markets"
echo "=========================================="
echo ""

ssh root@152.42.199.50 << 'EOF'
cd /root/aion-backend

echo "1. Checking current markets..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const now = new Date();
  const open = await prisma.market.findMany({ where: { status: 'OPEN' } });
  const expired = open.filter(m => m.closeTime < now);
  
  console.log('Total OPEN markets:', open.length);
  console.log('Expired markets:', expired.length);
  console.log('Actually open:', open.length - expired.length);
  
  await prisma.\$disconnect();
}

check();
"

echo ""
echo "2. Closing all expired markets..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function closeExpired() {
  const now = new Date();
  const result = await prisma.market.updateMany({
    where: {
      status: 'OPEN',
      closeTime: { lt: now }
    },
    data: { status: 'CLOSED' }
  });
  
  console.log('Closed', result.count, 'expired markets');
  await prisma.\$disconnect();
}

closeExpired();
"

echo ""
echo "3. Restarting market-cron to create new markets..."
pm2 restart market-cron

echo ""
echo "4. Waiting 10 seconds for cron to run..."
sleep 10

echo ""
echo "5. Checking new markets..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const now = new Date();
  const open = await prisma.market.findMany({ 
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('Open markets:', open.length);
  open.forEach(m => {
    const stillOpen = m.closeTime > now;
    console.log(\`  - \${m.title} (closes: \${m.closeTime.toISOString()}, valid: \${stillOpen})\`);
  });
  
  await prisma.\$disconnect();
}

check();
"

echo ""
echo "6. Checking PM2 logs..."
pm2 logs market-cron --lines 20 --nostream | tail -25

EOF

echo ""
echo "=========================================="
echo "Refresh Complete!"
echo "=========================================="
