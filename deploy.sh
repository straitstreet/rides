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
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
gcloud services enable maps-backend.googleapis.com --project=$PROJECT_ID
gcloud services enable places-backend.googleapis.com --project=$PROJECT_ID
gcloud services enable geocoding-backend.googleapis.com --project=$PROJECT_ID

# Wait for APIs to be enabled
echo "⏳ Waiting for APIs to be ready..."
sleep 15

# Setup secrets in Secret Manager
echo "🔐 Setting up secrets in Secret Manager..."

# Store all secrets in Secret Manager
SECRETS=(
    "clerk-publishable-key:pk_test_ZXF1YWwtZ3JvdXBlci05MS5jbGVyay5hY2NvdW50cy5kZXYk"
    "clerk-secret-key:sk_test_KJyJU7AmhlzJVTMLskCtq9kaWGbOcSc8mE0bhp2dUW"
    "paystack-public-key:pk_test_e3c3dda5f25089e0c664995182e29d474ce5dbbb"
    "paystack-secret-key:sk_test_e3c3dda5f25089e0c664995182e29d474ce5dbbb"
)

for secret_pair in "${SECRETS[@]}"; do
    secret_name=$(echo $secret_pair | cut -d: -f1)
    secret_value=$(echo $secret_pair | cut -d: -f2)

    # Check if secret already exists
    if gcloud secrets describe $secret_name --project=$PROJECT_ID >/dev/null 2>&1; then
        echo "  ✅ Secret $secret_name already exists"
    else
        echo "  📝 Creating secret $secret_name..."
        echo "$secret_value" | gcloud secrets create $secret_name --data-file=- --project=$PROJECT_ID
    fi
done

# Create Google Maps API key if needed
if ! gcloud secrets describe google-maps-api-key --project=$PROJECT_ID >/dev/null 2>&1; then
    echo "🗺️ Creating Google Maps API key..."

    # Create new API key
    API_KEY_RESULT=$(gcloud services api-keys create --display-name="Rides Maps API Key" \
        --api-target=service=maps-backend.googleapis.com \
        --api-target=service=places-backend.googleapis.com \
        --api-target=service=geocoding-backend.googleapis.com \
        --project=$PROJECT_ID 2>/dev/null)

    API_KEY=$(echo "$API_KEY_RESULT" | grep -o 'keyString":"[^"]*' | cut -d'"' -f3)

    if [ ! -z "$API_KEY" ]; then
        echo "  ✅ Google Maps API key created"
        echo "$API_KEY" | gcloud secrets create google-maps-api-key --data-file=- --project=$PROJECT_ID
        echo "  🔐 API key stored in Secret Manager"
    else
        echo "  ⚠️ Could not create API key automatically"
        echo "your_google_maps_api_key_here" | gcloud secrets create google-maps-api-key --data-file=- --project=$PROJECT_ID
    fi
else
    echo "✅ Google Maps API key already exists in Secret Manager"
fi

# Build and deploy using Cloud Build
echo "🏗️  Building application with Cloud Build..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/rides-app --project=$PROJECT_ID

# Deploy to Cloud Run with secrets
echo "🚀 Deploying to Cloud Run with Secret Manager integration..."
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
    --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID \
    --set-secrets NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk-publishable-key:latest \
    --set-secrets CLERK_SECRET_KEY=clerk-secret-key:latest \
    --set-secrets NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=paystack-public-key:latest \
    --set-secrets PAYSTACK_SECRET_KEY=paystack-secret-key:latest \
    --set-secrets NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=google-maps-api-key:latest \
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