#!/bin/bash

# Deploy script untuk Vercel
# Usage: ./scripts/deploy-vercel.sh [backend-url]

set -e

echo "🚀 Deploying to Vercel..."

# Check for backend URL argument
BACKEND_URL=${1:-""}

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Warning: No backend URL provided"
    echo "Usage: ./scripts/deploy-vercel.sh https://your-backend.railway.app"
    echo ""
    read -p "Enter your backend URL (or press Enter to skip): " BACKEND_URL
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Change to frontend directory
cd frontend

# Create or update .env.production
if [ ! -z "$BACKEND_URL" ]; then
    echo "📝 Creating .env.production..."
    echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production
    echo "✅ Environment file created"
fi

# Check if logged in
echo "🔐 Checking Vercel login..."
vercel whoami || vercel login

# Deploy to Vercel
echo "📤 Deploying frontend to Vercel..."
vercel --prod

echo "✅ Frontend deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Vercel URL from the output above"
echo "2. Update CORS_ORIGIN in Railway backend:"
echo "   railway variables set CORS_ORIGIN=https://your-app.vercel.app"
echo ""
echo "🌐 Your app should be live at the Vercel URL!"
