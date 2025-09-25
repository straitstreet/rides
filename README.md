# Rides - Car Rental Platform for Nigeria 🚗

A comprehensive car rental platform built for the Nigerian market, featuring Google Maps integration, PWA capabilities, Paystack integration, and automated deployment on Google Cloud Platform.

## 🚀 Quick Start

Get up and running in minutes with our automated setup:

```bash
# Clone and setup everything automatically
git clone https://github.com/straitstreet/rides.git
cd rides
./setup.sh
```

**That's it!** The script will:
- Install dependencies
- Set up Google Maps API automatically
- Configure environment files
- Build and start the development server

For manual setup or advanced configuration, see the [Manual Setup](#manual-setup) section below.

## 🌟 Overview

Rides is a modern car rental platform that connects car owners with renters across Nigeria. The platform provides a seamless experience for both car owners looking to monetize their vehicles and travelers needing reliable transportation.

### Key Features
- **🗺️ Google Maps Integration**: Location autocomplete and interactive maps
- **📱 Progressive Web App**: Offline capability and mobile-first design
- **💳 Paystack Integration**: Secure payments optimized for Nigeria
- **🔐 Clerk Authentication**: Secure user authentication with role management
- **📸 Image Management**: Cloud storage with automatic optimization
- **⭐ Review System**: Dual reviews between renters and car owners
- **🚀 Auto Deployment**: One-click deployment to Google Cloud Platform

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API routes, PostgreSQL, Drizzle ORM
- **Maps**: Google Maps JavaScript API, Places API, Geocoding API
- **Authentication**: Clerk with role-based access control
- **Payments**: Paystack (cards, bank transfers, USSD)
- **Storage**: Google Cloud Storage with CDN
- **Deployment**: Google Cloud Platform (Cloud Run, Cloud SQL, Cloud Build)

## 🏗️ Project Structure

```
/naija-rides/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (legal)/           # Legal pages (grouped route)
│   │   ├── admin/             # Admin dashboard
│   │   ├── cars/              # Car browsing
│   │   ├── dashboard/         # User dashboards
│   │   └── ...               # Other pages
│   ├── components/
│   │   ├── maps/              # Google Maps components
│   │   ├── reviews/           # Review system
│   │   ├── ui/                # ShadCN UI components
│   │   └── ...               # Other components
│   └── lib/
│       ├── db/                # Database schema & connection
│       ├── auth.ts            # Authentication utilities
│       └── ...               # Other utilities
├── scripts/
│   └── setup-google-maps.sh   # Automated Google Maps setup
├── terraform/                 # Infrastructure as Code
├── deploy/                    # Deployment configurations
├── setup.sh                  # Main setup script
└── README.md                 # This file
```

## 🚀 Automated Setup

### Option 1: Complete Automated Setup (Recommended)

```bash
# Setup with gcloud CLI (default)
./setup.sh --project-id your-project-id

# Or setup with Terraform
./setup.sh --project-id your-project-id --terraform
```

### Option 2: Google Maps API Only

```bash
# Automated Google Maps API setup
./scripts/setup-google-maps.sh
```

### Option 3: Infrastructure as Code with Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings
terraform init
terraform apply
```

The automated setup will:
- ✅ Check and install prerequisites (Node.js, Yarn, gcloud CLI)
- ✅ Enable required Google APIs programmatically
- ✅ Create API keys with proper restrictions
- ✅ Configure environment variables
- ✅ Install dependencies and build the project
- ✅ Start the development server

## 📍 Google Maps Integration

### Automated API Setup

The platform includes automated Google Maps API setup that:

1. **Enables Required APIs**:
   - Maps JavaScript API (for displaying maps)
   - Places API (for location autocomplete)
   - Geocoding API (for address conversion)

2. **Creates Secure API Keys**:
   - Automatic key generation with restrictions
   - Domain-based access control
   - API-specific permissions

3. **Configures Components**:
   - Location autocomplete with Nigerian city bias
   - Interactive car location maps
   - Pickup/dropoff location selection

### Manual Google Maps Setup

If you prefer manual setup:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing one
   - Enable billing for your project

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Enable: Maps JavaScript API, Places API, Geocoding API

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Restrict key to specific APIs and domains

4. **Add to Environment**
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_api_key_here"
   ```

### Google Maps Components

```typescript
// Available map components
import {
  GoogleMap,           // Core map component
  LocationAutocomplete, // Location search with autocomplete
  CarLocationMap       // Car-specific location display
} from '@/components/maps';

// Usage example
<LocationAutocomplete
  placeholder="Enter pickup location"
  bias="nigeria"
  onChange={(value, place) => {
    console.log('Selected:', place);
  }}
/>
```

### Nigerian Cities Support

Pre-configured coordinates for major Nigerian cities:
- Lagos, Abuja, Port Harcourt, Kano, Ibadan
- Benin City, Jos, Ilorin, Owerri, Calabar
- Enugu, Kaduna, Zaria, Warri, Akure

## 🗄️ Data Architecture

### Core Models

**Users**
- Profile: Name, email, phone, date of birth
- Verification: Driver's license, verification status
- Authentication: Clerk-based secure authentication

**Cars**
- Details: Make, model, year, color, specifications
- Pricing: Daily rates with decimal precision
- Location: City/area with GPS coordinates
- Availability: Real-time status and verification

**Bookings**
- Rental period with precise timing
- Status tracking (pending → confirmed → active → completed)
- Location management (pickup/dropoff)
- Payment integration with Paystack

**Reviews**
- Dual review system (renters ↔ car owners)
- 5-star ratings with detailed comments
- Trust and reputation building

### Database Schema (Drizzle ORM)

```typescript
// Example schema structure
users: {
  id: uuid,
  email: text (unique),
  firstName: text,
  lastName: text,
  phone: text,
  isVerified: boolean
}

cars: {
  id: uuid,
  ownerId: uuid (FK),
  make: text,
  model: text,
  dailyRate: decimal(10,2),
  location: text,
  latitude: decimal(10,8),
  longitude: decimal(11,8),
  isAvailable: boolean
}

bookings: {
  id: uuid,
  carId: uuid (FK),
  renterId: uuid (FK),
  startDate: timestamp,
  endDate: timestamp,
  totalAmount: decimal(10,2),
  status: text
}
```

## 💳 Payment Integration (Paystack)

Integrated payment solution optimized for the Nigerian market:

### Supported Payment Methods
- **Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking via USSD codes
- **Bank Branches**: Physical payment locations

### Payment Flow
1. User selects car and rental dates
2. Total calculated (daily rate × days)
3. Secure payment via Paystack
4. Webhook verification and booking confirmation

### Configuration
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **Admin**: Platform management and oversight
- **Seller**: Car owners managing their vehicles
- **Buyer**: Renters browsing and booking cars

### Authentication Setup (Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### Security Features
- User verification (driver's license, phone, email)
- Car verification (documents, photos, manual review)
- Secure file upload and storage
- CSRF and XSS protection

## 🎨 UI/UX Design System

### Design Principles
- **Nigerian-focused**: Naira currency, local cities, cultural context
- **Mobile-first**: Optimized for Nigerian mobile usage patterns
- **Clean & Professional**: Minimal design with clear hierarchy
- **Accessible**: ARIA labels, keyboard navigation, screen reader support

### Typography & Colors
- **Fonts**: Inter (text), Space Grotesk (headings/branding)
- **Colors**: Teal primary (`oklch(0.45 0.15 165)`), carefully crafted palette
- **Components**: ShadCN UI with custom variants

## 📱 Progressive Web App

### PWA Features
- **Offline Capability**: Browse cars without internet
- **Push Notifications**: Booking updates and reminders
- **Home Screen Install**: App-like mobile experience
- **Fast Loading**: Optimized for Nigerian network conditions

### PWA Configuration
```json
// manifest.json
{
  "name": "Rides - Car Rental Nigeria",
  "short_name": "Rides",
  "theme_color": "#0f766e",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

## 🚀 Deployment

### Automated Deployment

Deploy to Google Cloud Platform with one command:

```bash
# Deploy to production
PROJECT_ID=your-project ./deploy.sh
```

### Manual Deployment

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud builds submit --project=$PROJECT_ID
   ```

3. **Configure environment variables**
   - Set all required environment variables in Cloud Run
   - Configure Cloud SQL connection
   - Set up Cloud Storage bucket

### Infrastructure Components
- **Cloud Run**: Serverless container deployment
- **Cloud SQL**: Managed PostgreSQL database
- **Cloud Storage**: File storage with CDN
- **Cloud Build**: Automated CI/CD pipeline
- **Cloud CDN**: Global content delivery

### Environment Variables (Production)
```env
# Required for production
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
PAYSTACK_SECRET_KEY=""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
GOOGLE_CLOUD_PROJECT_ID=""
GOOGLE_CLOUD_STORAGE_BUCKET=""
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🛠️ Manual Setup

If you prefer manual setup or need to customize the installation:

### Prerequisites
- Node.js 18+
- Yarn package manager
- PostgreSQL database
- Google Cloud Platform account
- Paystack account (for payments)
- Clerk account (for authentication)

### Installation Steps

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/straitstreet/rides.git
   cd rides
   yarn install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Setup database**
   ```bash
   yarn db:generate
   yarn db:push
   ```

4. **Setup Google Maps (choose one)**
   ```bash
   # Option A: Automated setup
   ./scripts/setup-google-maps.sh

   # Option B: Terraform
   cd terraform && terraform apply
   ```

5. **Build and start**
   ```bash
   yarn build
   yarn dev
   ```

### Development Commands
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn db:generate  # Generate database migrations
yarn db:push      # Push schema to database
yarn db:studio    # Open database studio
```

## 🧪 Testing

### Running Tests
```bash
yarn test         # Run all tests
yarn test:watch   # Run tests in watch mode
yarn test:e2e     # Run end-to-end tests
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route and database testing
- **E2E Tests**: Full user journey testing with Playwright
- **Visual Tests**: UI component visual regression testing

## 🔍 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Integrated error reporting
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Usage patterns and conversion metrics
- **API Monitoring**: Response times and error rates

### Google Cloud Monitoring
- **Cloud Monitoring**: Infrastructure and application metrics
- **Cloud Logging**: Centralized log management
- **Cloud Trace**: Request tracing and performance analysis
- **Uptime Monitoring**: Service availability checks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Run tests and ensure they pass (`yarn test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled, full type coverage
- **ESLint**: Enforced code style and best practices
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Maps not loading?**
- Check API key configuration in `.env.local`
- Verify Google Maps APIs are enabled
- Check browser console for errors

**Payment issues?**
- Verify Paystack keys are correct
- Check webhook configuration
- Test with Paystack test cards

**Authentication problems?**
- Confirm Clerk keys are set
- Check user roles and permissions
- Verify middleware configuration

### Getting Help
- 📧 Email: support@rides.ng
- 🐛 Issues: [GitHub Issues](https://github.com/straitstreet/rides/issues)
- 📖 Documentation: This README covers everything!

### Troubleshooting

**Build failures?**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn build
```

**Database connection issues?**
```bash
# Reset database
yarn db:push --force
```

**Google Cloud deployment issues?**
- Check project permissions
- Verify billing is enabled
- Ensure all APIs are enabled

---

**🚀 Ready to get started?** Run `./setup.sh` and you'll be up and running in minutes!

Built with ❤️ for the Nigerian market by the Rides team.