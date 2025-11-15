# ⚡ Quick Deploy Guide

Panduan cepat untuk deploy aplikasi dalam 10 menit!

## 🚀 Cara Tercepat: One-Command Deploy

### Linux / macOS

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy everything!
./scripts/deploy-all.sh
```

### Windows

```bash
scripts\deploy-all.bat
```

---

## 📝 Manual Deploy (Step by Step)

### 1️⃣ Deploy Backend ke Railway (5 menit)

#### Via Dashboard (Paling Mudah - No CLI!)

1. **Buka https://railway.app** dan login dengan GitHub
2. **New Project** → **Deploy from GitHub repo**
3. **Select repository** ini
4. **Add MySQL database**:
   - Click **"+ New"** → **Database** → **Add MySQL**
   - Railway akan otomatis set DB environment variables
5. **Add service**:
   - Click **"+ New"** → **GitHub Repo** → pilih repo ini
   - Root directory: `backend`
6. **Set environment variables**:
   ```
   Click service → Variables → Raw Editor → paste:
   ```
   ```env
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=uploads
   JWT_SECRET=GENERATE_RANDOM_32_CHARS
   ENCRYPTION_SECRET=GENERATE_RANDOM_32_CHARS
   JWT_EXPIRES_IN=7d
   MAX_FILE_SIZE=10485760
   MAX_FILES=5
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   CORS_ORIGIN=*
   ```
7. **Generate Secrets**:
   - Buka https://www.random.org/strings/
   - Length: 32, Type: Alphanumeric
   - Copy hasil untuk JWT_SECRET dan ENCRYPTION_SECRET
8. **Deploy!**
   - Railway akan auto-deploy
   - Tunggu ~2-3 menit
9. **Get Backend URL**:
   - Click service → Settings → copy domain
   - Format: `https://your-app.railway.app`

✅ **Backend selesai!**

---

### 2️⃣ Deploy Frontend ke Vercel (3 menit)

#### Via Dashboard (Paling Mudah - No CLI!)

1. **Buka https://vercel.com** dan login dengan GitHub
2. **Add New** → **Project**
3. **Import** repository ini
4. **Configure**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. **Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     ```
     Name:  VITE_API_URL
     Value: https://your-backend.railway.app/api
     ```
     (ganti dengan Railway URL dari step 1)
6. **Deploy!**
   - Click **Deploy**
   - Tunggu ~1-2 menit
7. **Get Frontend URL**:
   - Copy URL dari Vercel
   - Format: `https://your-app.vercel.app`

✅ **Frontend selesai!**

---

### 3️⃣ Update CORS (1 menit)

Setelah frontend deploy, update CORS di backend:

1. **Buka Railway dashboard** → pilih backend service
2. **Variables** → cari `CORS_ORIGIN`
3. **Update** dengan Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
4. **Save** → Railway akan auto-redeploy

✅ **CORS configured!**

---

### 4️⃣ Create Admin User (2 menit)

1. **Buka aplikasi** di `https://your-app.vercel.app`
2. **Register** user baru
3. **Make as admin**:
   - Railway dashboard → MySQL database
   - **Query** tab → run:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
     ```
4. **Logout** dan **Login** lagi

✅ **Admin user ready!**

---

### 5️⃣ Configure Cloudinary (1 menit)

1. **Login** ke aplikasi
2. **Settings** → **Cloudinary** tab
3. **Fill in** credentials:
   - Cloud Name
   - API Key
   - API Secret
4. **Test Connection**
5. **Save**

✅ **Cloudinary configured!**

---

## 🎉 Done! Test Upload

1. **Home page** → drag & drop file
2. **Upload** → file akan ke Cloudinary Anda
3. **View** di gallery
4. **Delete** jika perlu

---

## 🐛 Troubleshooting

### Backend Error

```bash
# Check Railway logs
Railway dashboard → Service → Deployments → View Logs

# Common issues:
# - Database not connected: Check MySQL is added
# - Env vars missing: Check all variables are set
# - Migration failed: Run manually in Railway shell
```

### Frontend Error

```bash
# Check Vercel logs
Vercel dashboard → Project → Deployments → View Function Logs

# Common issues:
# - CORS error: Update CORS_ORIGIN in Railway
# - API not found: Check VITE_API_URL is correct
# - Build failed: Check node version (use 18+)
```

### CORS Error

```bash
# Exact Vercel URL harus match
CORS_ORIGIN=https://your-app.vercel.app

# NO trailing slash!
# WRONG: https://your-app.vercel.app/
# RIGHT: https://your-app.vercel.app
```

---

## ⏱️ Total Time

- **Backend**: 5 minutes
- **Frontend**: 3 minutes
- **CORS**: 1 minute
- **Admin**: 2 minutes
- **Cloudinary**: 1 minute
- **Total**: ~12 minutes

---

## 💰 Cost

**Free Tier:**
- Railway: $5 credit/month (~500 hours)
- Vercel: Free (100GB bandwidth)
- Cloudinary: Free (25 credits/month)
- **Total: $0/month** untuk low traffic

**Paid Plan (Optional):**
- Railway Pro: $5/month + usage
- Vercel Pro: $20/month
- Cloudinary Plus: $99/month

---

## 📚 Full Documentation

Untuk deployment advanced, lihat **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## ✅ Checklist

- [ ] Backend deployed to Railway
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Frontend deployed to Vercel
- [ ] CORS_ORIGIN updated
- [ ] Admin user created
- [ ] Cloudinary configured
- [ ] Test upload working

---

**Happy deploying! 🚀**
