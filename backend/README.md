# Backend Auto-Resolve Service

## Running Locally
```bash
cd backend
node autoResolve.js
```

## Deploy to Server (24/7)

### Option 1: Railway.app
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Select `Aion-x` repo
4. Set Root Directory: `backend`
5. Add environment variables:
   - `OWNER_PRIVATE_KEY`: Your deployer private key
6. Deploy

### Option 2: Render.com
1. Create account at https://render.com
2. New Background Worker
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node autoResolve.js`
7. Add environment variable `OWNER_PRIVATE_KEY`

### Option 3: PM2 (VPS)
```bash
npm install -g pm2
cd backend
pm2 start autoResolve.js --name aion-backend
pm2 save
pm2 startup
```

## Environment Variables
- `OWNER_PRIVATE_KEY`: Private key with owner access to contract
