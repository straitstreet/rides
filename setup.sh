#!/bin/bash

# Rides Platform Complete Setup Script
# Automates the entire platform setup including Google Maps API

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-straitstreet-rides}"
SETUP_METHOD="${SETUP_METHOD:-gcloud}" # or 'terraform'

echo -e "${PURPLE}"
echo "██████╗ ██╗██████╗ ███████╗███████╗"
echo "██╔══██╗██║██╔══██╗██╔════╝██╔════╝"
echo "██████╔╝██║██║  ██║█████╗  ███████╗"
echo "██╔══██╗██║██║  ██║██╔══╝  ╚════██║"
echo "██║  ██║██║██████╔╝███████╗███████║"
echo "╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝╚══════╝"
echo -e "${NC}"
echo -e "${BLUE}🚀 Complete Platform Setup${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
        exit 1
    fi

    # Check Yarn
    if ! command -v yarn &> /dev/null; then
        echo -e "${RED}❌ Yarn not found. Installing Yarn...${NC}"
        npm install -g yarn
    fi

    # Check gcloud CLI
    if [ "$SETUP_METHOD" == "gcloud" ] && ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ Google Cloud CLI not found. Installing...${NC}"
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL  # Reload shell
    fi

    # Check Terraform (optional)
    if [ "$SETUP_METHOD" == "terraform" ] && ! command -v terraform &> /dev/null; then
        echo -e "${YELLOW}⚠️ Terraform not found. Installing...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install terraform || {
                echo -e "${RED}❌ Failed to install Terraform. Please install manually.${NC}"
                exit 1
            }
        else
            echo -e "${RED}❌ Please install Terraform manually: https://terraform.io/downloads${NC}"
            exit 1
        fi
    fi

    echo -e "${GREEN}✅ Prerequisites check complete${NC}"
}

# Function to setup project dependencies
setup_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"

    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found. Are you in the project root?${NC}"
        exit 1
    fi

    # Install dependencies
    yarn install

    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to setup environment files
setup_environment() {
    echo -e "${YELLOW}📝 Setting up environment files...${NC}"

    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        cp .env.local.example .env.local 2>/dev/null || {
            echo -e "${YELLOW}⚠️ .env.local.example not found, creating basic .env.local${NC}"
            cat > .env.local << EOF
# Local Development Environment
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLOUD_PROJECT_ID="$PROJECT_ID"

# Add your API keys here:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="your_paystack_public_key"
PAYSTACK_SECRET_KEY="your_paystack_secret_key"
EOF
        }
    fi

    echo -e "${GREEN}✅ Environment files setup${NC}"
}

# Function to setup Google Maps API
setup_google_maps() {
    echo -e "${YELLOW}🗺️ Setting up Google Maps API...${NC}"

    if [ "$SETUP_METHOD" == "terraform" ]; then
        echo -e "${BLUE}Using Terraform for Google Maps setup...${NC}"

        cd terraform

        # Initialize Terraform
        terraform init

        # Create terraform.tfvars if it doesn't exist
        if [ ! -f "terraform.tfvars" ]; then
            cp terraform.tfvars.example terraform.tfvars
            echo -e "${YELLOW}⚠️ Please edit terraform/terraform.tfvars with your settings${NC}"
            read -p "Press enter when ready to continue..."
        fi

        # Plan and apply
        terraform plan
        terraform apply -auto-approve

        # Extract API key
        API_KEY=$(terraform output -raw api_key)
        cd ..

    else
        echo -e "${BLUE}Using gcloud CLI for Google Maps setup...${NC}"

        # Run Google Maps setup script
        chmod +x scripts/setup-google-maps.sh
        ./scripts/setup-google-maps.sh

        # Extract API key from .env.local
        API_KEY=$(grep "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" .env.local | cut -d '"' -f 2)
    fi

    if [ ! -z "$API_KEY" ] && [ "$API_KEY" != "your_google_maps_api_key_here" ]; then
        echo -e "${GREEN}✅ Google Maps API setup complete${NC}"
    else
        echo -e "${YELLOW}⚠️ Google Maps API key not configured${NC}"
    fi
}

# Function to build and test
build_and_test() {
    echo -e "${YELLOW}🔨 Building and testing...${NC}"

    # Run build
    yarn build

    # Run tests if they exist
    if [ -f "package.json" ] && grep -q "test" package.json; then
        yarn test 2>/dev/null || echo -e "${YELLOW}⚠️ No tests found or test failed${NC}"
    fi

    echo -e "${GREEN}✅ Build successful${NC}"
}

# Function to start development server
start_development() {
    echo -e "${YELLOW}🚀 Starting development server...${NC}"

    echo -e "${GREEN}✅ Setup complete! Starting development server...${NC}"
    echo -e "${BLUE}📋 Access your application at: http://localhost:3000${NC}"
    echo -e "${BLUE}📋 Admin panel: http://localhost:3000/admin${NC}"
    echo -e "${BLUE}📋 Dashboard: http://localhost:3000/dashboard${NC}"
    echo ""
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo -e "   • Configure Clerk authentication keys"
    echo -e "   • Add Paystack payment keys"
    echo -e "   • Test Google Maps functionality"
    echo -e "   • Deploy to production"
    echo ""

    # Start the development server
    yarn dev
}

# Main execution
main() {
    echo -e "${BLUE}Project ID: $PROJECT_ID${NC}"
    echo -e "${BLUE}Setup Method: $SETUP_METHOD${NC}"
    echo ""

    check_prerequisites
    setup_dependencies
    setup_environment
    setup_google_maps
    build_and_test
    start_development
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        --terraform)
            SETUP_METHOD="terraform"
            shift
            ;;
        --gcloud)
            SETUP_METHOD="gcloud"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --project-id ID    Google Cloud Project ID (default: straitstreet-rides)"
            echo "  --terraform        Use Terraform for Google Maps setup"
            echo "  --gcloud           Use gcloud CLI for Google Maps setup (default)"
            echo "  --help             Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  GOOGLE_CLOUD_PROJECT_ID    Google Cloud Project ID"
            echo "  SETUP_METHOD               Setup method: 'gcloud' or 'terraform'"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main