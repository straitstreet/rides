# Deployment Guide for Rides

This guide provides step-by-step instructions for deploying the Rides car rental platform to Google Cloud Platform (GCP).

## Prerequisites

Before starting the deployment process, ensure you have:

1. **Google Cloud Platform Account**: Active GCP account with billing enabled
2. **Google Cloud CLI**: Install and configure the `gcloud` CLI tool
3. **Terraform** (Optional): For infrastructure as code deployment
4. **Domain Name**: Optional, for custom domain setup
5. **Third-party API Keys**:
   - Paystack API keys (test and live)
   - Clerk authentication keys

## Quick Setup with Script

The fastest way to set up your GCP infrastructure is using our automated setup script:

```bash
# Make the setup script executable
chmod +x deploy/setup-gcp.sh

# Set your project ID and run the setup
PROJECT_ID=your-project-id ./deploy/setup-gcp.sh
```

This script will automatically:
- Enable required GCP APIs
- Create Cloud SQL PostgreSQL instance
- Create Cloud Storage bucket for images
- Set up service accounts and permissions
- Create necessary secrets in Secret Manager

## Manual Deployment Steps

If you prefer manual setup, follow these detailed steps:

### 1. Create GCP Project

```bash
# Create a new project (or use existing one)
gcloud projects create your-project-id --name="Rides Car Rental"

# Set the project as default
gcloud config set project your-project-id

# Enable billing for the project (required)
# This must be done through the GCP Console
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Set Up Database

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create rides-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create the database
gcloud sql databases create rides --instance=rides-db

# Create database user
gcloud sql users create rides-user \
  --instance=rides-db \
  --password=your-secure-password
```

### 4. Set Up Storage

```bash
# Create storage bucket for images
gsutil mb -l US gs://your-project-id-rides-storage

# Make bucket publicly readable for images
gsutil iam ch allUsers:objectViewer gs://your-project-id-rides-storage

# Set up CORS for the bucket
echo '[{"origin": ["*"], "method": ["GET", "HEAD", "PUT", "POST", "DELETE"], "responseHeader": ["*"], "maxAgeSeconds": 3600}]' > cors.json
gsutil cors set cors.json gs://your-project-id-rides-storage
rm cors.json
```

### 5. Create Service Account

```bash
# Create service account for Cloud Run
gcloud iam service-accounts create rides-cloudrun \
  --display-name="Rides Cloud Run Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:rides-cloudrun@your-project-id.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:rides-cloudrun@your-project-id.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:rides-cloudrun@your-project-id.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 6. Store Secrets

```bash
# Database URL
CONNECTION_NAME=$(gcloud sql instances describe rides-db --format="value(connectionName)")
DATABASE_URL="postgresql://rides-user:your-password@localhost:5432/rides?host=/cloudsql/$CONNECTION_NAME"
echo -n "$DATABASE_URL" | gcloud secrets create DATABASE_URL --data-file=-

# Clerk API keys
echo -n "your-clerk-publishable-key" | gcloud secrets create CLERK_PUBLISHABLE_KEY --data-file=-
echo -n "your-clerk-secret-key" | gcloud secrets create CLERK_SECRET_KEY --data-file=-

# Paystack API keys
echo -n "your-paystack-public-key" | gcloud secrets create PAYSTACK_PUBLIC_KEY --data-file=-
echo -n "your-paystack-secret-key" | gcloud secrets create PAYSTACK_SECRET_KEY --data-file=-
```

### 7. Build and Deploy Application

```bash
# Build the Docker image
docker build -t gcr.io/your-project-id/rides-app .

# Push to Google Container Registry
docker push gcr.io/your-project-id/rides-app

# Deploy to Cloud Run
gcloud run deploy rides-app \
  --image gcr.io/your-project-id/rides-app \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --service-account rides-cloudrun@your-project-id.iam.gserviceaccount.com \
  --add-cloudsql-instances $CONNECTION_NAME \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=CLERK_PUBLISHABLE_KEY:latest,CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest,NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=PAYSTACK_PUBLIC_KEY:latest,PAYSTACK_SECRET_KEY=PAYSTACK_SECRET_KEY:latest"
```

## Using Terraform (Recommended for Production)

For production deployments, use Terraform for infrastructure as code:

```bash
# Navigate to terraform directory
cd deploy/terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var="project_id=your-project-id" -var="db_password=your-secure-password"

# Apply the infrastructure
terraform apply -var="project_id=your-project-id" -var="db_password=your-secure-password"
```

## GitHub Actions CI/CD Setup

To enable automatic deployments:

1. **Set up Workload Identity Federation** (recommended) or create service account keys

2. **Add the following secrets to your GitHub repository**:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `WIF_PROVIDER`: Workload Identity Federation provider
   - `WIF_SERVICE_ACCOUNT`: Service account email

3. **Push to main branch** to trigger deployment

## Environment Variables

Set these environment variables in your deployment:

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Paystack public key
- `PAYSTACK_SECRET_KEY`: Paystack secret key

### Optional
- `GOOGLE_CLOUD_PROJECT_ID`: GCP project ID
- `GOOGLE_CLOUD_STORAGE_BUCKET`: Storage bucket name
- `NEXT_PUBLIC_APP_URL`: Your app's URL

## Database Migration

After deployment, run database migrations:

```bash
# Connect to Cloud SQL instance
gcloud sql connect rides-db --user=rides-user --database=rides

# Run migrations (this would be automated in a real app)
# The Drizzle ORM migrations would be run automatically on first boot
```

## Monitoring and Maintenance

### Logs
```bash
# View Cloud Run logs
gcloud logs read --filter="resource.type=cloud_run_revision" --limit=50
```

### Scaling
```bash
# Update Cloud Run service configuration
gcloud run services update rides-app \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 200
```

### SSL/HTTPS
Cloud Run automatically provides SSL certificates. For custom domains:

```bash
# Map custom domain
gcloud run domain-mappings create --service rides-app --domain your-domain.com --region us-central1
```

## Cost Optimization

For cost optimization:

1. **Use appropriate instance sizes**: Start with `db-f1-micro` for development
2. **Set up Cloud Run minimum instances**: Use 0 for development, 1+ for production
3. **Enable Cloud SQL automatic backups**: Only keep necessary backup retention
4. **Use Cloud Storage lifecycle policies**: Automatically delete old images if needed

## Troubleshooting

### Common Issues

1. **Cloud SQL Connection Issues**:
   ```bash
   # Check Cloud SQL instance status
   gcloud sql instances describe rides-db

   # Test connection
   gcloud sql connect rides-db --user=rides-user
   ```

2. **Secret Manager Access**:
   ```bash
   # Verify secret exists
   gcloud secrets versions list DATABASE_URL

   # Test secret access
   gcloud secrets versions access latest --secret="DATABASE_URL"
   ```

3. **Storage Access Issues**:
   ```bash
   # Check bucket permissions
   gsutil iam get gs://your-project-id-rides-storage
   ```

4. **Cloud Run Deployment Issues**:
   ```bash
   # Check service status
   gcloud run services describe rides-app --region us-central1

   # View recent logs
   gcloud logs read --filter="resource.type=cloud_run_revision" --limit=10
   ```

## Support

For additional support:
- Check the [GitHub Issues](https://github.com/straitstreet/rides/issues)
- Review GCP documentation for [Cloud Run](https://cloud.google.com/run/docs)
- Check [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs) documentation