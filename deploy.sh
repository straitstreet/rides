#!/bin/bash

# Naija Rides - GCP Deployment Script
# Make sure you have gcloud CLI installed and authenticated

set -e

echo "🚗 Deploying Naija Rides to Google Cloud Platform..."

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID environment variable is not set"
    echo "Please set it with: export PROJECT_ID=your-project-id"
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable maps-backend.googleapis.com --project=$PROJECT_ID
gcloud services enable places-backend.googleapis.com --project=$PROJECT_ID
gcloud services enable geocoding-backend.googleapis.com --project=$PROJECT_ID

# Build and deploy using Cloud Build
echo "🏗️  Building application with Cloud Build..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/rides-app --project=$PROJECT_ID

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy naija-rides-app \
    --image gcr.io/$PROJECT_ID/rides-app \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --port 3000 \
    --set-env-vars NODE_ENV=production,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1YWwtZ3JvdXBlci05MS5jbGVyay5hY2NvdW50cy5kZXYk,CLERK_SECRET_KEY=sk_test_KJyJU7AmhlzJVTMLskCtq9kaWGbOcSc8mE0bhp2dUW,NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_e3c3dda5f25089e0c664995182e29d474ce5dbbb,PAYSTACK_SECRET_KEY=sk_test_e3c3dda5f25089e0c664995182e29d474ce5dbbb \
    --project=$PROJECT_ID

# Get the deployed URL
SERVICE_URL=$(gcloud run services describe naija-rides-app --platform managed --region us-central1 --format 'value(status.url)' --project=$PROJECT_ID)

echo "✅ Deployment successful!"
echo "🌐 Your app is live at: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "  1. Set up a custom domain if needed"
echo "  2. Configure environment variables for production"
echo "  3. Set up monitoring and logging"
echo "  4. Configure CI/CD pipeline"