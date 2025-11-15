#!/bin/bash

# Deploy script untuk Railway
# Usage: ./scripts/deploy-railway.sh

set -e

echo "🚀 Deploying to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Change to backend directory
cd backend

# Check if logged in
echo "🔐 Checking Railway login..."
railway whoami || railway login

# Deploy to Railway
echo "📤 Deploying backend to Railway..."
railway up

echo "✅ Backend deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Check deployment: railway status"
echo "2. View logs: railway logs"
echo "3. Set environment variables if needed: railway variables set KEY=VALUE"
echo "4. Run migrations: railway run npm run db:migrate"
echo ""
echo "🌐 Get your backend URL: railway status"
