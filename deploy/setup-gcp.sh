#!/bin/bash

# Rides - GCP Setup Script
# This script sets up the Google Cloud Platform infrastructure for the Rides application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-""}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="rides-app"

print_step() {
    echo -e "${BLUE}==> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if project ID is set
if [ -z "$PROJECT_ID" ]; then
    print_error "PROJECT_ID environment variable is required"
    echo "Usage: PROJECT_ID=your-project-id ./setup-gcp.sh"
    exit 1
fi

print_step "Setting up Rides application on GCP"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Set the project
print_step "Setting GCP project"
gcloud config set project $PROJECT_ID
print_success "Project set to $PROJECT_ID"

# Enable required APIs
print_step "Enabling required APIs"
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable containerregistry.googleapis.com
print_success "APIs enabled"

# Create Cloud SQL instance
print_step "Creating Cloud SQL PostgreSQL instance"
if gcloud sql instances describe rides-db --quiet 2>/dev/null; then
    print_warning "Cloud SQL instance 'rides-db' already exists"
else
    gcloud sql instances create rides-db \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --backup-start-time=03:00 \
        --enable-bin-log \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=04 \
        --authorized-networks=0.0.0.0/0
    print_success "Cloud SQL instance created"
fi

# Create database
print_step "Creating database"
if gcloud sql databases describe rides --instance=rides-db --quiet 2>/dev/null; then
    print_warning "Database 'rides' already exists"
else
    gcloud sql databases create rides --instance=rides-db
    print_success "Database created"
fi

# Create database user
print_step "Creating database user"
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create rides-user \
    --instance=rides-db \
    --password=$DB_PASSWORD 2>/dev/null || print_warning "User might already exist"
print_success "Database user created"

# Create storage bucket
print_step "Creating storage bucket"
BUCKET_NAME="$PROJECT_ID-rides-storage"
if gsutil ls gs://$BUCKET_NAME 2>/dev/null; then
    print_warning "Storage bucket already exists"
else
    gsutil mb -l US gs://$BUCKET_NAME
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
    print_success "Storage bucket created and configured"
fi

# Create secrets
print_step "Creating secrets in Secret Manager"

# Database URL secret
CONNECTION_NAME=$(gcloud sql instances describe rides-db --format="value(connectionName)")
DATABASE_URL="postgresql://rides-user:$DB_PASSWORD@localhost:5432/rides?host=/cloudsql/$CONNECTION_NAME"

gcloud secrets create DATABASE_URL --data-file=<(echo -n "$DATABASE_URL") 2>/dev/null || \
gcloud secrets versions add DATABASE_URL --data-file=<(echo -n "$DATABASE_URL")

print_success "Database URL secret created"

# Create service account
print_step "Creating service account"
if gcloud iam service-accounts describe rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com --quiet 2>/dev/null; then
    print_warning "Service account already exists"
else
    gcloud iam service-accounts create rides-cloudrun \
        --display-name="Rides Cloud Run Service Account"
    print_success "Service account created"
fi

# Grant permissions
print_step "Granting permissions to service account"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

print_success "Permissions granted"

# Output summary
echo ""
print_success "GCP setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up your environment variables:"
echo "   - DATABASE_URL: Available in Secret Manager"
echo "   - Add your Clerk and Paystack API keys to Secret Manager"
echo ""
echo "2. Deploy your application:"
echo "   yarn build && docker build -t gcr.io/$PROJECT_ID/rides-app ."
echo "   docker push gcr.io/$PROJECT_ID/rides-app"
echo ""
echo "3. Deploy to Cloud Run:"
echo "   gcloud run deploy rides-app \\"
echo "     --image gcr.io/$PROJECT_ID/rides-app \\"
echo "     --region $REGION \\"
echo "     --platform managed \\"
echo "     --allow-unauthenticated \\"
echo "     --service-account rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com \\"
echo "     --add-cloudsql-instances $CONNECTION_NAME \\"
echo "     --set-secrets DATABASE_URL=DATABASE_URL:latest"
echo ""
echo "Resources created:"
echo "- Cloud SQL instance: rides-db"
echo "- Database: rides"
echo "- Storage bucket: $BUCKET_NAME"
echo "- Service account: rides-cloudrun@$PROJECT_ID.iam.gserviceaccount.com"