# 🚀 Deploy AION-X Frontend ke Vercel

## Prerequisites

- ✅ Repository sudah di GitHub: https://github.com/0xCryptotech/AION-X-POLYGON
- ✅ Account Vercel (gratis): https://vercel.com/signup
- ✅ Contract addresses sudah ada

---

## 📋 Deployment Steps

### Step 1: Login ke Vercel

1. **Buka**: https://vercel.com/login
2. **Login** dengan GitHub account (0xCryptotech)
3. **Authorize** Vercel untuk akses GitHub

### Step 2: Import Project

1. **Click**: "Add New..." → "Project"
2. **Import Git Repository**:
   - Cari: `AION-X-POLYGON`
   - Click: "Import"

### Step 3: Configure Project

#### Framework Preset:
- **Framework**: Vite (auto-detected) ✅

#### Root Directory:
- **Root Directory**: `frontend` ⚠️ PENTING!
- Click "Edit" dan ketik: `frontend`

#### Build Settings:
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 4: Environment Variables

Click "Environment Variables" dan tambahkan:

```
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=https://your-backend-url.com
VITE_CHAIN_ID=80002
```

**Note**: Ganti `VITE_BACKEND_URL` dengan URL backend Anda nanti

### Step 5: Deploy!

1. **Click**: "Deploy"
2. **Wait**: ~2-3 minutes untuk build
3. **Done!** ✅

---

## 🎯 Setelah Deployment

### Your App URL:
Vercel akan memberikan URL seperti:
- `https://aion-x-polygon.vercel.app`
- atau custom domain jika Anda set

### Verifikasi:

1. **Buka URL** yang diberikan Vercel
2. **Test Features**:
   - ✅ Homepage loads
   - ✅ Connect wallet works
   - ✅ Contract addresses correct
   - ✅ Faucet page accessible
   - ✅ Battle page accessible

---

## 🔧 Troubleshooting

### Build Failed: "Cannot find module"

**Solution**: Pastikan Root Directory = `frontend`

### Environment Variables Not Working

**Solution**: 
1. Pastikan prefix `VITE_` ada
2. Redeploy setelah add env vars

### 404 on Refresh

**Solution**: Sudah di-handle di `vercel.json` dengan rewrites

### Contract Connection Failed

**Solution**: 
1. Cek VITE_CONTRACT_ADDRESS benar
2. Cek VITE_CHAIN_ID = 80002
3. Cek MetaMask di Polygon Amoy

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain:

1. **Go to**: Project Settings → Domains
2. **Add Domain**: `yourdomain.com`
3. **Configure DNS**:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   
   OR
   
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

4. **Wait**: DNS propagation (~5-10 minutes)
5. **Done!** ✅

---

## 🔄 Auto-Deploy on Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel will auto-deploy! 🚀
```

---

## 📊 Monitoring

### View Deployments:
- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: View traffic, performance
- **Logs**: Debug issues

### Performance:
- **Lighthouse Score**: Check on Vercel
- **Web Vitals**: Monitor user experience

---

## 💡 Tips

### 1. Preview Deployments
- Every PR gets preview URL
- Test before merging to main

### 2. Environment Variables per Branch
- Production: main branch
- Preview: other branches
- Can set different env vars

### 3. Rollback
- Can rollback to previous deployment
- Go to Deployments → Click deployment → Promote to Production

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Contract addresses verified
- [ ] Backend URL configured
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Test wallet connection
- [ ] Verify transactions work
- [ ] Check console for errors
- [ ] Test on different browsers
- [ ] Add custom domain (optional)

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

---

## 🎉 Success!

Your AION-X frontend is now live on Vercel!

**Share your app**:
- Twitter
- Discord
- Telegram
- Reddit

---

**Deployment Date**: _______________
**Vercel URL**: _______________
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete
