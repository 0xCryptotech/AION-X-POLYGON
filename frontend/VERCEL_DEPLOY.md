# 🚀 Vercel Deployment Guide

## ✅ Status Konfigurasi

### File Sudah Siap:
- ✅ `vercel.json` - Konfigurasi Vercel
- ✅ `package.json` - Build script
- ✅ `vite.config.js` - Vite config
- ✅ `.env.example` - Template environment variables
- ✅ `.gitignore` - Exclude .env dari git

## 📋 Langkah Deploy ke Vercel

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. **Push ke GitHub**
   ```bash
   cd /Users/idcuq/Documents/AION-X\ POLYGON/Aion-x-main
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import di Vercel**
   - Buka https://vercel.com
   - Click "Add New Project"
   - Import repository GitHub Anda
   - Select `frontend` folder sebagai root directory

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables** (Tambahkan di Vercel Dashboard)
   ```
   VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
   VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
   VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
   VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
   VITE_BACKEND_URL=https://your-backend-url.com
   VITE_CHAIN_ID=80002
   ```

5. **Deploy**
   - Click "Deploy"
   - Tunggu build selesai (~2-3 menit)

### 3. Deploy via CLI (Alternative)

```bash
cd frontend
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **aion-x-frontend**
- Directory? **./frontend**
- Override settings? **N**

## ⚙️ Environment Variables untuk Production

**PENTING**: Update `VITE_BACKEND_URL` dengan URL backend production Anda.

Jika backend belum deploy:
1. Deploy backend dulu (Railway, Render, atau VPS)
2. Dapatkan URL backend
3. Update env variable di Vercel

## 🔧 Troubleshooting

### Build Error: "Cannot find module"
```bash
cd frontend
npm install
npm run build
```

### WebSocket Connection Failed
- Pastikan Pyth Network endpoint accessible: `https://hermes.pyth.network`
- Check browser console untuk error

### Contract Connection Failed
- Verify contract addresses di environment variables
- Pastikan MetaMask connected ke Polygon Amoy Testnet

## 📱 Custom Domain (Optional)

1. Di Vercel Dashboard → Settings → Domains
2. Add domain Anda
3. Update DNS records sesuai instruksi Vercel

## 🔄 Auto Deploy

Setiap push ke branch `main` akan otomatis trigger deployment baru.

## 📊 Monitoring

- Build logs: Vercel Dashboard → Deployments
- Runtime logs: Vercel Dashboard → Logs
- Analytics: Vercel Dashboard → Analytics

## ✅ Checklist Pre-Deploy

- [ ] `.env` tidak di-commit ke git
- [ ] All dependencies installed (`npm install`)
- [ ] Build berhasil lokal (`npm run build`)
- [ ] Environment variables sudah disiapkan
- [ ] Backend URL sudah production-ready
- [ ] Contract addresses sudah benar
- [ ] Pyth Network integration tested

## 🎯 Post-Deploy

1. Test live URL
2. Connect wallet (MetaMask)
3. Test Pyth Network live price
4. Test contract interactions
5. Monitor errors di Vercel logs
