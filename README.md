# Naija Rides - Car Rental Platform

> **Enterprise-grade car rental platform for the Nigerian market**

[![Production Build](https://img.shields.io/badge/build-passing-green.svg)](#deployment)
[![Security](https://img.shields.io/badge/security-enterprise--grade-blue.svg)](#security)
[![Deployment](https://img.shields.io/badge/deployment-google--cloud-blue.svg)](#deployment)

A comprehensive, production-ready car rental platform specifically designed for the Nigerian market. Built with Next.js 15, TypeScript, and modern cloud infrastructure, it connects car owners with renters across major Nigerian cities with enterprise-level security, scalability, and reliability.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- PostgreSQL database
- Google Cloud Platform account
- Required API keys (see Environment Variables)

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd naija-rides
   yarn install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL (Docker)
   yarn db:setup

   # Generate and push schema
   yarn db:generate
   yarn db:push
   ```

4. **Start Development Server**
   ```bash
   yarn dev
   ```

   Visit `http://localhost:3000`

## 🗄️ Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/naija_rides"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Payments (Paystack)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production Variables

For production deployment, use:
- Live Clerk keys (`pk_live_...`, `sk_live_...`)
- Live Paystack keys (`pk_live_...`, `sk_live_...`)
- Production database URL
- Production domain for `NEXT_PUBLIC_APP_URL`

## 🚗 Platform Overview

Naija Rides is a modern car rental platform that connects car owners with renters across Nigeria. The platform provides a seamless experience for both car owners looking to monetize their vehicles and travelers needing reliable transportation.

### Key Features

- **Invite-First Access**: Closed platform with one-time access codes for quality control
- **Enterprise Security**: Role-based authentication, comprehensive CSP headers, input validation
- **Mobile-First Design**: PWA-ready, responsive design optimized for Nigerian mobile usage
- **Local Payment Integration**: Paystack integration supporting cards, bank transfers, and USSD
- **Maps Integration**: Google Maps for location services and car tracking
- **Admin Dashboard**: Comprehensive admin portal for user, car, and booking management
- **Real-time Features**: Live booking status, notifications, and analytics
- **Cloud-Ready**: Google Cloud Platform deployment with auto-scaling
- **Review System**: Dual reviews between renters and car owners
- **Monitoring**: Google Cloud Logging integration with structured metrics

## 🏗️ Technology Stack

### Core Framework
- **Frontend**: Next.js 15.5.4 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with ShadCN UI components
- **Database**: PostgreSQL with Drizzle ORM 0.36.4
- **Authentication**: Clerk 6.32.2 with role-based access control
- **Payments**: Paystack (Nigerian payment gateway)
- **Maps**: Google Maps API with Places autocomplete
- **State Management**: TanStack React Query 5.90.2
- **Cloud**: Google Cloud Platform (Cloud Run, Cloud Build, Secret Manager)
- **Monitoring**: Structured logging with Google Cloud Logging integration

### System Architecture

```mermaid
graph TB
    LB[Load Balancer<br/>Google Cloud Load Balancer] --> CR[Cloud Run<br/>Auto-scaling Containers]
    CR --> DB[(PostgreSQL<br/>Cloud SQL)]
    CR --> SM[Secret Manager<br/>Environment Variables]
    CR --> CS[Cloud Storage<br/>File Uploads]

    subgraph "External APIs"
        CLERK[Clerk Authentication]
        PAYSTACK[Paystack Payments]
        GMAPS[Google Maps API]
    end

    CR --> CLERK
    CR --> PAYSTACK
    CR --> GMAPS

    subgraph "Monitoring"
        LOGS[Cloud Logging]
        METRICS[Cloud Monitoring]
        TRACES[Cloud Trace]
    end

    CR --> LOGS
    CR --> METRICS
    CR --> TRACES
```

## 👥 User Roles & Access Control

### 1. Admin (`admin`)
- **Access**: Full platform administration at `/admin/*`
- **Capabilities**:
  - User management and verification
  - Invite code generation and management
  - Car listing approval/rejection
  - Booking oversight and dispute resolution
  - Platform analytics and reporting
  - System configuration and settings

### 2. Seller/Car Owner (`seller`)
- **Access**: Car owner dashboard at `/dashboard`
- **Capabilities**:
  - Add and manage car listings
  - Upload multiple images (up to 10 per car)
  - View and manage bookings
  - Track earnings and analytics
  - Respond to rental requests

### 3. Buyer/Renter (`buyer`)
- **Access**: Renter dashboard at `/dashboard`
- **Capabilities**:
  - Search and book cars
  - Manage trip history
  - Favorite cars and owners
  - Submit reviews and ratings

## 🎟️ Invite-First System

### Overview
The platform operates as a closed system requiring one-time access codes for registration to maintain quality and control growth.

### Admin Invite Management
- Generate unique one-time access codes
- Set expiration dates for codes
- Track code usage and analytics
- Manage invitation campaigns
- Monitor platform growth

### User Registration Flow
1. User receives invite code from admin
2. Visits registration page with code
3. Code validated against database
4. Successful validation allows account creation
5. Code is marked as used and cannot be reused

## 🛡️ Admin Dashboard

The admin dashboard provides comprehensive platform management:

### User Management (`/admin/users`)
- View all platform users
- Verify user accounts and documents
- Suspend/activate accounts
- User analytics and insights

### Invite Management (`/admin/invites`)
- Generate one-time access codes
- Set code expiration dates
- Track code usage statistics
- Manage invitation campaigns
- View registration analytics

### Car Management (`/admin/cars`)
- Review and approve car listings
- Verify vehicle documents
- Monitor car performance
- Handle car-related disputes

### Booking Management (`/admin/bookings`)
- Oversee all platform bookings
- Monitor booking trends
- Resolve booking disputes
- Revenue tracking

### Analytics (`/admin/analytics`)
- Platform KPIs and metrics
- Revenue and growth trends
- User behavior analytics
- Top performing cities and cars

### Reports & Issues (`/admin/reports`)
- User-reported issues
- Safety and security reports
- Dispute resolution
- Platform moderation

### System Settings (`/admin/settings`)
- Platform configuration
- Payment settings
- Security policies
- API management

## 🗄️ Database Schema (Drizzle ORM)

### Core Tables

#### `users`
```typescript
{
  id: uuid (PK),
  email: text (unique),
  firstName: text,
  lastName: text,
  phone: text (unique),
  dateOfBirth: timestamp,
  driversLicenseNumber: text,
  driversLicenseExpiry: timestamp,
  profileImage: text,
  isVerified: boolean (default: false),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `inviteCodes`
```typescript
{
  id: uuid (PK),
  code: text (unique),
  email: text (optional - for targeted invites),
  role: text (buyer, seller, admin),
  createdBy: uuid (FK -> users.id),
  usedBy: uuid (FK -> users.id, nullable),
  expiresAt: timestamp,
  usedAt: timestamp (nullable),
  isActive: boolean (default: true),
  createdAt: timestamp
}
```

#### `cars`
```typescript
{
  id: uuid (PK),
  ownerId: uuid (FK -> users.id),
  make: text,
  model: text,
  year: integer,
  color: text,
  plateNumber: text (unique),
  vin: text (unique),
  fuelType: text, // petrol, diesel, hybrid, electric
  transmission: text, // manual, automatic
  seats: integer,
  category: text, // economy, compact, mid-size, full-size, luxury, suv
  dailyRate: decimal(10,2),
  description: text,
  features: text, // JSON string of features array
  location: text, // city/area in Nigeria
  latitude: decimal(10,8),
  longitude: decimal(11,8),
  isAvailable: boolean (default: true),
  isVerified: boolean (default: false),
  // Indexes on: ownerId, location, isAvailable
}
```

#### `carImages`
```typescript
{
  id: uuid (PK),
  carId: uuid (FK -> cars.id, cascade delete),
  imageUrl: text,
  isPrimary: boolean (default: false),
  createdAt: timestamp
}
```

#### `bookings`
```typescript
{
  id: uuid (PK),
  carId: uuid (FK -> cars.id),
  renterId: uuid (FK -> users.id),
  startDate: timestamp,
  endDate: timestamp,
  totalAmount: decimal(10,2),
  status: text, // pending, confirmed, active, completed, cancelled
  pickupLocation: text,
  dropoffLocation: text,
  specialRequests: text,
  // Indexes on: carId, renterId, status
}
```

#### `payments`
```typescript
{
  id: uuid (PK),
  bookingId: uuid (FK -> bookings.id),
  paystackReference: text (unique),
  amount: decimal(10,2),
  status: text, // pending, success, failed
  paymentMethod: text, // card, bank_transfer, ussd
  paidAt: timestamp,
  // Indexes on: bookingId, paystackReference
}
```

#### `reviews`
```typescript
{
  id: uuid (PK),
  bookingId: uuid (FK -> bookings.id),
  reviewerId: uuid (FK -> users.id),
  reviewedId: uuid (FK -> users.id), // car owner or renter
  rating: integer, // 1-5 stars
  comment: text,
  reviewType: text, // renter_review, owner_review
  // Indexes on: bookingId, reviewedId
}
```

## 🔐 Security Features

### Authentication & Authorization
- **Clerk Integration**: Enterprise-grade authentication
- **Role-Based Access Control**: Admin, seller, buyer roles
- **Route Protection**: Middleware-based route security
- **Session Management**: Secure session handling
- **Invite Code Validation**: One-time access code verification

### API Security
- **Rate Limiting**: Per-endpoint rate limiting (10-100 requests/minute)
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **CORS Protection**: Configured CORS policies
- **Authentication Middleware**: JWT token validation

### Headers & Policies
- **Content Security Policy**: Comprehensive CSP headers
- **Security Headers**: XSS protection, frame options, HSTS
- **HTTPS Enforcement**: SSL/TLS in production

### Data Protection
- **Secret Management**: Google Cloud Secret Manager
- **Environment Isolation**: Separate dev/staging/prod
- **PCI Compliance**: Paystack payment processing
- **File Upload Security**: Type, size, and count validation

## 🏃‍♂️ Development Commands

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn db:generate  # Generate database migrations
yarn db:push      # Push schema to database
yarn db:migrate   # Apply database migrations
yarn db:studio    # Open database studio
yarn db:setup     # Start PostgreSQL (Docker) and push schema
yarn db:up        # Start database container
yarn db:down      # Stop database container
yarn db:seed      # Seed admin user
yarn test:api     # Test API endpoints
```

## 📂 Project Structure

```
/naija-rides/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (legal)/                  # Legal pages (grouped route)
│   │   │   ├── cookies/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── admin/                    # Admin dashboard
│   │   │   ├── analytics/
│   │   │   ├── bookings/
│   │   │   ├── cars/
│   │   │   ├── invites/              # Invite management
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   ├── cars/                     # Car browsing page
│   │   ├── dashboard/                # User dashboards
│   │   ├── about/                    # About page
│   │   ├── contact/                  # Contact page
│   │   ├── help/                     # Help center
│   │   ├── list-car/                 # List car for rent
│   │   ├── register/                 # User registration
│   │   ├── safety/                   # Safety information
│   │   ├── api/                      # API routes
│   │   │   ├── cars/[id]/images/     # Image upload API
│   │   │   ├── invites/              # Invite management API
│   │   │   │   ├── validate/         # Validate invite codes
│   │   │   │   └── use/              # Use invite codes
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── health/               # Health check endpoint
│   │   │   ├── payments/paystack/webhook/ # Payment webhooks
│   │   │   ├── reviews/              # Review system API
│   │   │   └── users/me/             # User profile API
│   │   ├── layout.tsx                # Root layout with Clerk provider
│   │   ├── page.tsx                  # Homepage with car listings
│   │   └── globals.css               # Tailwind CSS with custom variables
│   ├── components/
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── admin-header.tsx
│   │   │   └── admin-sidebar.tsx
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── buyer-dashboard.tsx
│   │   │   ├── seller-dashboard.tsx
│   │   │   ├── dashboard-header.tsx
│   │   │   └── dashboard-sidebar.tsx
│   │   ├── maps/                     # Google Maps components
│   │   ├── reviews/                  # Review system components
│   │   │   ├── review-card.tsx
│   │   │   ├── review-form.tsx
│   │   │   └── review-summary.tsx
│   │   ├── ui/                       # ShadCN UI components
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── multiple-image-upload.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── [other ui components]
│   │   ├── booking-modal.tsx         # Car booking modal
│   │   └── error-boundary.tsx        # Error handling component
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle ORM schema
│   │   │   └── index.ts              # Database connection
│   │   ├── api/
│   │   │   ├── middleware.ts         # API middleware
│   │   │   └── validation.ts         # Zod schemas
│   │   ├── auth.ts                   # Client-side auth utilities
│   │   ├── auth-server.ts            # Server-side auth utilities
│   │   ├── monitoring.ts             # Logging and metrics
│   │   ├── react-query.tsx           # React Query configuration
│   │   ├── seed-data.ts              # Sample data & helper functions
│   │   └── utils.ts                  # Utility functions (cn helper)
│   ├── hooks/
│   │   ├── api/                      # API hooks
│   │   └── use-car-images.ts         # Image management hook
│   └── scripts/
│       └── seed-admin.ts             # Admin seeding script
├── deploy/                           # Deployment configurations
├── drizzle/                          # Database migrations
├── docker-compose.yml                # Local development setup
├── Dockerfile                        # Production container
├── README.md                         # This file
├── package.json                      # Dependencies and scripts
├── components.json                   # ShadCN UI configuration
├── drizzle.config.ts                 # Database configuration
├── next.config.js                    # Next.js configuration
└── tsconfig.json                     # TypeScript configuration
```

## 📱 Features

### Multiple Image Upload System
- **Max Images**: 10 per car listing
- **File Size Limit**: 5MB per image
- **Supported Formats**: JPEG, PNG, WebP
- **Features**:
  - Drag & drop upload interface
  - Image preview and management
  - Primary image selection
  - Real-time validation
  - Progress tracking
  - Error handling

### Payment Integration (Paystack)
Integrated payment solution optimized for the Nigerian market:

#### Supported Payment Methods
- **Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking via USSD codes
- **Bank Branches**: Physical payment locations

#### Payment Flow
1. User selects car and rental dates
2. Total calculated (daily rate × days)
3. Secure payment via Paystack
4. Webhook verification and booking confirmation

### Google Maps Integration
- **Location Autocomplete**: Nigerian city bias
- **Interactive Maps**: Car location display
- **Pickup/Dropoff Selection**: Location selection interface
- **API Setup**: Automated Google Maps API configuration

### Review System
- **Dual Reviews**: Renters ↔ car owners
- **5-Star Ratings**: Detailed rating system
- **Comment System**: Detailed feedback
- **Trust Building**: Reputation system

## 🚀 Production Deployment

### Automated Deployment

Deploy to Google Cloud Platform with one command:

```bash
# Deploy to production
PROJECT_ID=your-project ./deploy.sh
```

**Successfully Deployed**: This application is currently running in production at:
- **Production URL**: [https://naija-rides-app-53hiswdaka-uc.a.run.app](https://naija-rides-app-53hiswdaka-uc.a.run.app)
- **Platform**: Google Cloud Run (Serverless)
- **Region**: us-central1
- **Status**: Active and ready for production use

### Infrastructure Components
- **Cloud Run**: Serverless container deployment
- **Cloud SQL**: Managed PostgreSQL database
- **Cloud Storage**: File storage with CDN
- **Cloud Build**: Automated CI/CD pipeline
- **Cloud CDN**: Global content delivery
- **Secret Manager**: Secure environment variables

### Production Environment Variables
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

## 📊 Monitoring & Analytics

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

### Health Checks
- **Application Health**: `/api/health` endpoint
- **Database Connectivity**: Automated health checks
- **External Service Status**: API dependency monitoring

## 🧪 Testing

### Running Tests
```bash
yarn test:api     # Run API endpoint tests
```

### Testing Strategy
- **API Tests**: Comprehensive API endpoint testing (Node.js test suite)
- **Integration Tests**: API route and database testing
- **Manual Testing**: UI and user journey testing
- **Production Monitoring**: Health checks and error tracking

## 🔧 Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled, full type coverage
- **ESLint**: Enforced code style and best practices
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### When Adding New Features
1. **Update Database Schema**: Add new tables/columns in `src/lib/db/schema.ts`
2. **Create Seed Data**: Add sample data in `src/lib/seed-data.ts`
3. **Build Components**: Use ShadCN UI components as base
4. **Add Types**: Define TypeScript interfaces
5. **Test Roles**: Ensure proper role-based access
6. **Mobile Responsive**: Test on mobile breakpoints

## 🔍 Known Issues & Troubleshooting

### Database Connection Issues
If you encounter PostgreSQL connection issues:

```bash
# Reset database
yarn db:down && yarn db:up
yarn db:push --force
```

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn build
```

### Google Cloud Deployment Issues
- Check project permissions
- Verify billing is enabled
- Ensure all APIs are enabled

## 🎯 Future Enhancements

### Short Term
- **Redis Integration**: Session and rate limit storage
- **Image Processing**: Resize, compression, optimization
- **Push Notifications**: Real-time updates
- **Advanced Search**: Filters and sorting

### Long Term
- **Machine Learning**: Pricing optimization
- **Mobile App**: React Native implementation
- **Multi-language**: Support for local languages
- **IoT Integration**: Car tracking and monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Run tests and ensure they pass (`yarn test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Email**: support@rides.ng
- **Issues**: [GitHub Issues](https://github.com/straitstreet/rides/issues)
- **Documentation**: This README covers everything!

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

---

**Ready to get started?** Run `yarn dev` and you'll be up and running in minutes!

Built for the Nigerian market with ❤️ by the Naija Rides team.