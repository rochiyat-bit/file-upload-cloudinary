# 🚀 Deployment Guide

Panduan lengkap untuk deploy aplikasi ke production menggunakan Vercel (Frontend) + Railway/Render (Backend).

## 📋 Arsitektur Deployment

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Vercel         │────▶│  Railway/Render  │────▶│  Railway MySQL  │
│  (Frontend)     │     │  (Backend API)   │     │  (Database)     │
│  React + Vite   │     │  Node.js Express │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │  Cloudinary │
                        │  (Storage)  │
                        └─────────────┘
```

## 🎯 Opsi Deployment

### **Opsi A: Railway (Recommended - Paling Mudah)**
- ✅ Free tier tersedia
- ✅ MySQL included
- ✅ Auto deploy dari GitHub
- ✅ Environment variables management
- ✅ Built-in monitoring

### **Opsi B: Render**
- ✅ Free tier tersedia
- ✅ Managed PostgreSQL/MySQL
- ✅ Auto deploy dari GitHub
- ✅ Custom domains

---

## 📦 Opsi A: Deploy ke Railway + Vercel

### **Step 1: Setup Railway (Backend + Database)**

#### 1.1 Create Railway Account
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

#### 1.2 Deploy Backend ke Railway

```bash
cd backend

# Initialize Railway project
railway init

# Link to your project
railway link

# Add MySQL database
# Buka Railway dashboard → Add MySQL service

# Set environment variables
railway variables set NODE_ENV=production
railway variables set CLOUDINARY_CLOUD_NAME=your_cloud_name
railway variables set CLOUDINARY_API_KEY=your_api_key
railway variables set CLOUDINARY_API_SECRET=your_api_secret
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set ENCRYPTION_SECRET=$(openssl rand -base64 32)
railway variables set CORS_ORIGIN=https://your-app.vercel.app

# Railway akan auto-detect MySQL dan set DB variables:
# - DB_HOST
# - DB_PORT
# - DB_NAME
# - DB_USERNAME
# - DB_PASSWORD

# Deploy
railway up
```

#### 1.3 Cara Mudah via Dashboard (No CLI)

1. **Buka https://railway.app**
2. **New Project** → **Deploy from GitHub repo**
3. **Select repository** → pilih folder `backend`
4. **Add MySQL database** dari Railway dashboard
5. **Add environment variables** (lihat list di bawah)
6. **Deploy** otomatis berjalan!

**Environment Variables untuk Railway:**
```env
NODE_ENV=production
PORT=5000

# Database (auto-filled by Railway MySQL)
# DB_HOST=<auto>
# DB_PORT=<auto>
# DB_NAME=<auto>
# DB_USERNAME=<auto>
# DB_PASSWORD=<auto>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=uploads

# Upload Config
MAX_FILE_SIZE=10485760
MAX_FILES=5

# CORS (ganti dengan URL Vercel Anda)
CORS_ORIGIN=https://your-app.vercel.app

# Security (generate random string)
JWT_SECRET=generate-random-32-chars-or-more
ENCRYPTION_SECRET=generate-random-32-chars-or-more
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate JWT_SECRET & ENCRYPTION_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Atau gunakan online generator:
# https://www.random.org/strings/
```

#### 1.4 Run Migrations

```bash
# Via Railway CLI
railway run npm run db:migrate

# Atau via Railway dashboard:
# Settings → Deploy → Add custom start command:
# npm run db:migrate && npm start
```

#### 1.5 Get Backend URL

```bash
railway status

# Atau dari dashboard, copy URL:
# https://your-app.railway.app
```

---

### **Step 2: Deploy Frontend ke Vercel**

#### 2.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### 2.2 Deploy via Vercel Dashboard (Recommended)

1. **Buka https://vercel.com**
2. **Import Project** → **Import Git Repository**
3. **Select repository** dan root directory: `frontend`
4. **Framework Preset**: Vite
5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
6. **Deploy**!

#### 2.3 Deploy via CLI (Alternative)

```bash
cd frontend

# Update .env.production
echo "VITE_API_URL=https://your-backend.railway.app/api" > .env.production

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 2.4 Update CORS di Backend

Setelah deploy, update CORS_ORIGIN di Railway:

```bash
# Railway CLI
railway variables set CORS_ORIGIN=https://your-app.vercel.app

# Atau via Railway dashboard
```

---

### **Step 3: Setup First Admin User**

#### 3.1 Register User via Frontend

1. Buka `https://your-app.vercel.app/register`
2. Register user pertama

#### 3.2 Make User as Admin

```bash
# Via Railway CLI
railway connect

# Lalu di MySQL console:
mysql> USE railway;
mysql> UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
mysql> exit;

# Atau via Railway dashboard:
# MySQL → Connect → Query
```

#### 3.3 Login & Configure Cloudinary

1. Login dengan user admin
2. Pergi ke **Settings** → **Cloudinary**
3. Isi credentials Cloudinary Anda
4. Test connection
5. Save

#### 3.4 Test Upload

Upload file untuk memastikan semuanya berfungsi!

---

## 📦 Opsi B: Deploy ke Render + Vercel

### **Step 1: Deploy Backend ke Render**

#### 1.1 Via Render Dashboard

1. **Buka https://render.com**
2. **New** → **Web Service**
3. **Connect repository** (GitHub)
4. **Settings**:
   - **Name**: file-upload-api
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run db:migrate && npm start`
   - **Plan**: Free

5. **Environment Variables** (sama seperti Railway list di atas)

6. **Create Web Service**

#### 1.2 Add MySQL Database (Optional)

Render tidak punya MySQL free tier, jadi bisa:
- Gunakan Railway MySQL (free)
- Gunakan PlanetScale (free)
- Gunakan AWS RDS free tier

**Contoh: Gunakan Railway MySQL untuk Render Backend**

```bash
# Create MySQL di Railway
railway init
railway add

# Get database credentials dari Railway
railway variables

# Set di Render environment variables:
DB_HOST=<from railway>
DB_PORT=<from railway>
DB_NAME=<from railway>
DB_USERNAME=<from railway>
DB_PASSWORD=<from railway>
DB_SSL=true
```

### **Step 2: Deploy Frontend ke Vercel**

Sama seperti Opsi A, Step 2.

---

## 🔧 Post-Deployment Checklist

### ✅ Backend

- [ ] Backend URL accessible: `https://your-backend.railway.app/health`
- [ ] Database connected (check logs)
- [ ] Migrations ran successfully
- [ ] Environment variables set correctly
- [ ] CORS configured with Vercel URL

### ✅ Frontend

- [ ] Frontend deployed: `https://your-app.vercel.app`
- [ ] API URL configured correctly
- [ ] Login/Register working
- [ ] Can access all pages

### ✅ Testing

- [ ] Register new user
- [ ] Login successfully
- [ ] Configure Cloudinary in Settings
- [ ] Upload file
- [ ] View files in gallery
- [ ] Delete file
- [ ] Admin can access User Management

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database

```bash
# Check database credentials
railway variables

# Test connection
railway run npm run db:migrate

# Check logs
railway logs
```

### CORS Error di Frontend

```bash
# Update CORS_ORIGIN di backend
railway variables set CORS_ORIGIN=https://your-exact-vercel-url.vercel.app

# Atau via dashboard
```

### Migration Error

```bash
# Manual run migration
railway run npm run db:migrate

# Check migration status
railway run npx sequelize-cli db:migrate:status
```

### File Upload Gagal

1. **Check Cloudinary credentials** di Settings
2. **Test connection** sebelum upload
3. **Check file size limit** (default 10MB)
4. **Check browser console** untuk error details

### Environment Variables tidak terbaca

```bash
# Railway: Check variables
railway variables

# Vercel: Check via dashboard
# Settings → Environment Variables

# Re-deploy after changing env vars
railway up  # Railway
vercel --prod  # Vercel
```

---

## 📊 Monitoring & Logs

### Railway

```bash
# View logs
railway logs

# Follow logs (real-time)
railway logs -f

# Via dashboard
# Project → Deployments → View Logs
```

### Vercel

```bash
# View logs
vercel logs

# Via dashboard
# Project → Deployments → View Function Logs
```

### Render

- **Dashboard** → **Logs** tab
- Real-time logs available

---

## 💰 Cost Estimates

### Free Tier (Recommended for Testing)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Railway** | $5 credit/month | ~500 hours uptime |
| **Vercel** | Free | 100GB bandwidth |
| **Cloudinary** | Free | 25 credits/month |
| **Total** | **$0/month** | Good for low traffic |

### Production (Paid)

| Service | Plan | Cost/month |
|---------|------|------------|
| **Railway Pro** | Hobby | $5 + usage |
| **Vercel Pro** | Pro | $20 |
| **Cloudinary** | Plus | $99 |
| **Total** | | ~$124/month |

---

## 🔄 CI/CD Setup

### Auto-Deploy dari GitHub

#### Railway
✅ **Auto-enabled!** Push ke GitHub = auto deploy

#### Vercel
✅ **Auto-enabled!** Push ke GitHub = auto deploy

#### Custom GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🎉 Selesai!

Aplikasi Anda sudah live di:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

Selamat! 🚀
