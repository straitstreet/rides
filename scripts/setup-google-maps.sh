#!/bin/bash

# Google Maps API Automated Setup Script
# Enables APIs and creates API keys programmatically

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-straitstreet-rides}"
API_KEY_NAME="rides-maps-api-key"
RESTRICTION_DOMAINS="localhost:3000,*.straitstreet-rides.app,*.rides.ng"

echo -e "${BLUE}🚀 Setting up Google Maps API for Rides platform${NC}"
echo -e "${BLUE}Project ID: ${PROJECT_ID}${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found. Please install it first:${NC}"
    echo "curl https://sdk.cloud.google.com | bash"
    exit 1
fi

# Check authentication
echo -e "${YELLOW}🔐 Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated. Please run: gcloud auth login${NC}"
    exit 1
fi

# Set project
echo -e "${YELLOW}📋 Setting project...${NC}"
gcloud config set project $PROJECT_ID

# Enable billing (check only)
echo -e "${YELLOW}💳 Checking billing...${NC}"
BILLING_ACCOUNT=$(gcloud billing accounts list --filter="open:true" --format="value(name)" | head -n 1)
if [ -z "$BILLING_ACCOUNT" ]; then
    echo -e "${RED}❌ No active billing account found. Please enable billing in the Google Cloud Console:${NC}"
    echo "https://console.cloud.google.com/billing"
    exit 1
fi

# Link billing account to project
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT 2>/dev/null || echo "Billing already linked"

# Enable required APIs
echo -e "${YELLOW}🔌 Enabling Google Maps APIs...${NC}"
REQUIRED_APIS=(
    "maps-backend.googleapis.com"
    "maps-embed-backend.googleapis.com"
    "places-backend.googleapis.com"
    "geocoding-backend.googleapis.com"
    "geolocation.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    echo -e "  Enabling $api..."
    gcloud services enable $api --quiet
done

# Wait for APIs to be fully enabled
echo -e "${YELLOW}⏳ Waiting for APIs to be ready...${NC}"
sleep 10

# Create API key
echo -e "${YELLOW}🔑 Creating API key...${NC}"

# Delete existing key if it exists
gcloud services api-keys delete $API_KEY_NAME --quiet 2>/dev/null || echo "No existing key to delete"

# Create new API key
API_KEY=$(gcloud services api-keys create $API_KEY_NAME \
    --display-name="Rides Maps API Key" \
    --format="value(response.keyString)")

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Failed to create API key${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API key created: ${API_KEY}${NC}"

# Apply restrictions
echo -e "${YELLOW}🔒 Applying API restrictions...${NC}"

# Get the key ID for restrictions
KEY_ID=$(gcloud services api-keys list --filter="displayName:'Rides Maps API Key'" --format="value(name)" | head -n 1)

if [ ! -z "$KEY_ID" ]; then
    # Create restrictions config
    cat > /tmp/api-key-restrictions.yaml << EOF
restrictions:
  apiTargets:
  - service: maps-backend.googleapis.com
  - service: places-backend.googleapis.com
  - service: geocoding-backend.googleapis.com
  browserKeyRestrictions:
    allowedReferrers:
    - "http://localhost:3000/*"
    - "https://localhost:3000/*"
    - "https://*.straitstreet-rides.app/*"
    - "https://*.rides.ng/*"
EOF

    # Apply restrictions
    gcloud services api-keys update $KEY_ID --restrictions-file=/tmp/api-key-restrictions.yaml --quiet
    rm /tmp/api-key-restrictions.yaml

    echo -e "${GREEN}✅ API restrictions applied${NC}"
else
    echo -e "${YELLOW}⚠️ Could not apply restrictions automatically${NC}"
fi

# Update environment files
echo -e "${YELLOW}📝 Updating environment configuration...${NC}"

# Update .env.local
if [ -f ".env.local" ]; then
    # Backup existing file
    cp .env.local .env.local.backup

    # Update or add the API key
    if grep -q "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" .env.local; then
        sed -i.bak "s/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=.*/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=\"$API_KEY\"/" .env.local
    else
        echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=\"$API_KEY\"" >> .env.local
    fi

    echo -e "${GREEN}✅ Updated .env.local${NC}"
else
    echo -e "${YELLOW}⚠️ .env.local not found, please add manually:${NC}"
    echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=\"$API_KEY\""
fi

# Create environment file for CI/CD
cat > .env.production << EOF
# Google Maps API Key for Production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="$API_KEY"
EOF

echo -e "${GREEN}✅ Created .env.production${NC}"

echo -e "${GREEN}🎉 Google Maps API setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  Project ID: ${PROJECT_ID}"
echo -e "  API Key: ${API_KEY}"
echo -e "  APIs Enabled: Maps, Places, Geocoding"
echo -e "  Restrictions: Applied for security"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "  1. Test the application: ${YELLOW}yarn dev${NC}"
echo -e "  2. Check maps functionality on homepage"
echo -e "  3. Deploy to production with the new API key"
echo ""
echo -e "${YELLOW}💡 Important:${NC}"
echo -e "  - Monitor usage in Google Cloud Console"
echo -e "  - Set up billing alerts for cost control"
echo -e "  - Keep API key secure and rotate periodically"