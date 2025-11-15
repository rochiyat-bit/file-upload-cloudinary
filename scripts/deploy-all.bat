@echo off
REM Full deployment script for Windows (Railway + Vercel)
REM Usage: scripts\deploy-all.bat

echo ╔════════════════════════════════════════════╗
echo ║   Full Stack Deployment Script            ║
echo ║   Backend: Railway ^| Frontend: Vercel     ║
echo ╚════════════════════════════════════════════╝
echo.

REM Step 1: Deploy Backend to Railway
echo 📦 Step 1: Deploying Backend to Railway...
echo ─────────────────────────────────────────────

cd backend

REM Check Railway CLI
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📥 Installing Railway CLI...
    npm install -g @railway/cli
)

echo 🔐 Login to Railway...
railway login

echo 📤 Deploying backend...
railway up

echo.
echo ✅ Backend deployed!
echo.

REM Get Railway URL
echo 🌐 Getting backend URL...
for /f "tokens=*" %%i in ('railway status') do set BACKEND_STATUS=%%i
echo Backend Status: %BACKEND_STATUS%
echo.
set /p BACKEND_URL="Enter your Railway backend URL: "

echo ✅ Backend URL: %BACKEND_URL%
echo.

REM Step 2: Run Migrations
echo 📊 Step 2: Running Database Migrations...
echo ─────────────────────────────────────────────
railway run npm run db:migrate
echo ✅ Migrations complete!
echo.

REM Back to root
cd ..

REM Step 3: Deploy Frontend to Vercel
echo 🎨 Step 3: Deploying Frontend to Vercel...
echo ─────────────────────────────────────────────

cd frontend

REM Check Vercel CLI
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
)

REM Create .env.production
echo 📝 Configuring frontend environment...
echo VITE_API_URL=%BACKEND_URL%/api > .env.production

echo 🔐 Login to Vercel...
vercel login

echo 📤 Deploying frontend...
vercel --prod

echo.
echo ✅ Frontend deployed!
echo.

REM Back to root
cd ..

REM Step 4: Final configuration
echo ⚙️  Step 4: Final Configuration...
echo ─────────────────────────────────────────────
echo.
echo Please get your Vercel URL from the output above, then run:
echo.
echo   cd backend
echo   railway variables set CORS_ORIGIN=https://your-app.vercel.app
echo.
echo Or update CORS_ORIGIN manually in Railway dashboard
echo.

echo ╔════════════════════════════════════════════╗
echo ║         🎉 Deployment Complete! 🎉        ║
echo ╚════════════════════════════════════════════╝
echo.
echo 📋 Next Steps:
echo   1. Update CORS_ORIGIN in Railway (see above)
echo   2. Create admin user:
echo      - Register via frontend
echo      - railway connect (MySQL)
echo      - UPDATE users SET role='admin' WHERE email='your@email.com';
echo   3. Configure Cloudinary in Settings page
echo   4. Test file upload!
echo.
echo 🌐 URLs:
echo   Backend:  %BACKEND_URL%
echo   Frontend: (check Vercel output above)
echo.
echo 📊 Monitoring:
echo   Backend logs:  railway logs
echo   Frontend logs: vercel logs
echo.

pause
