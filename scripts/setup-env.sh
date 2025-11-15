#!/bin/bash

# Setup environment variables untuk Railway
# Usage: ./scripts/setup-env.sh

set -e

echo "🔧 Railway Environment Variables Setup"
echo "════════════════════════════════════════"
echo ""

cd backend

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "Run: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
railway whoami || railway login

echo "📝 Setting up environment variables..."
echo ""

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_SECRET=$(openssl rand -base64 32)

echo "✅ Generated JWT_SECRET"
echo "✅ Generated ENCRYPTION_SECRET"
echo ""

# Set NODE_ENV
railway variables set NODE_ENV=production
echo "✅ Set NODE_ENV=production"

# Set secrets
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set ENCRYPTION_SECRET="$ENCRYPTION_SECRET"
echo "✅ Set JWT_SECRET and ENCRYPTION_SECRET"

# Set JWT expiry
railway variables set JWT_EXPIRES_IN=7d
echo "✅ Set JWT_EXPIRES_IN=7d"

# Prompt for Cloudinary credentials
echo ""
echo "📦 Cloudinary Configuration"
echo "─────────────────────────────"
read -p "Cloudinary Cloud Name: " CLOUD_NAME
read -p "Cloudinary API Key: " API_KEY
read -sp "Cloudinary API Secret: " API_SECRET
echo ""

railway variables set CLOUDINARY_CLOUD_NAME="$CLOUD_NAME"
railway variables set CLOUDINARY_API_KEY="$API_KEY"
railway variables set CLOUDINARY_API_SECRET="$API_SECRET"
railway variables set CLOUDINARY_FOLDER=uploads

echo "✅ Cloudinary credentials set"
echo ""

# Set upload limits
railway variables set MAX_FILE_SIZE=10485760
railway variables set MAX_FILES=5
echo "✅ Upload limits set (10MB, 5 files max)"

# Set rate limiting
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
echo "✅ Rate limiting set"

# Prompt for CORS origin
echo ""
read -p "Frontend URL (Vercel URL or leave empty for now): " CORS_URL
if [ ! -z "$CORS_URL" ]; then
    railway variables set CORS_ORIGIN="$CORS_URL"
    echo "✅ CORS_ORIGIN set to $CORS_URL"
else
    railway variables set CORS_ORIGIN="*"
    echo "⚠️  CORS_ORIGIN set to * (wildcard) - update this later!"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ Environment Setup Complete!          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📋 Variables set:"
echo "  - NODE_ENV"
echo "  - JWT_SECRET (generated)"
echo "  - ENCRYPTION_SECRET (generated)"
echo "  - JWT_EXPIRES_IN"
echo "  - CLOUDINARY_* (your credentials)"
echo "  - MAX_FILE_SIZE, MAX_FILES"
echo "  - RATE_LIMIT_*"
echo "  - CORS_ORIGIN"
echo ""
echo "📊 View all variables: railway variables"
echo "🚀 Ready to deploy: railway up"
echo ""
