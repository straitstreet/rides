# Rides - Car Rental Platform for Nigeria

A comprehensive car rental platform built for the Nigerian market, featuring PWA capabilities, Paystack integration, and deployment on Google Cloud Platform.

## 🚗 Overview

Rides is a modern car rental platform that connects car owners with renters across Nigeria. The platform provides a seamless experience for both car owners looking to monetize their vehicles and travelers needing reliable transportation.

## 🏗️ Data Models & Architecture

### Core Data Models

#### Users
- **Profile Information**: Name, email, phone, date of birth
- **Verification**: Driver's license details, profile image, verification status
- **Authentication**: Secure user authentication with Clerk

#### Cars
- **Vehicle Details**: Make, model, year, color, plate number, VIN
- **Specifications**: Fuel type, transmission, seats, category (economy, luxury, SUV, etc.)
- **Pricing**: Daily rental rates with decimal precision
- **Location**: City/area with optional GPS coordinates for precise pickup
- **Availability**: Real-time availability status and verification

#### Car Images
- **Multiple Images**: Support for multiple car photos per vehicle
- **Primary Image**: Designated main image for listings
- **Cloud Storage**: Images stored on Google Cloud Storage

#### Bookings
- **Rental Period**: Start and end dates with time precision
- **Pricing**: Total amount calculation based on daily rates
- **Status Tracking**: Pending, confirmed, active, completed, cancelled
- **Locations**: Pickup and dropoff locations with special requests

#### Payments
- **Paystack Integration**: Secure payment processing for Nigerian market
- **Payment Methods**: Cards, bank transfers, USSD
- **Transaction Tracking**: Payment status and reference management

#### Reviews & Ratings
- **Dual Reviews**: Both renters and car owners can review each other
- **5-Star Rating System**: Detailed rating with optional comments
- **Trust Building**: Helps build reputation within the platform

### 📷 Image Storage Strategy

#### Google Cloud Storage Integration
- **Bucket Structure**:
  - `rides-car-images/` - Car photos
  - `rides-profile-images/` - User profile pictures
  - `rides-documents/` - Verification documents

#### Image Processing
- **Multiple Sizes**: Automatic generation of thumbnail, medium, and full-size versions
- **Format Optimization**: WebP for modern browsers, fallback to JPEG
- **CDN Delivery**: Google Cloud CDN for fast global image delivery

#### Upload Flow
1. Client uploads image to secured endpoint
2. Server validates file type and size
3. Image processed and stored in GCS
4. URLs saved to database with metadata
5. Old images automatically cleaned up

### 🔐 Security & Verification

#### User Verification
- **Driver's License**: Upload and manual verification
- **Phone Verification**: OTP-based phone number verification
- **Email Verification**: Secure email confirmation

#### Car Verification
- **Vehicle Documents**: License, insurance, roadworthiness certificates
- **Photo Verification**: Multiple angles including interior/exterior
- **Manual Review**: Admin approval process for safety

### 🌍 Location & Availability

#### Geographic Coverage
- **Major Cities**: Lagos, Abuja, Port Harcourt, Kano, Ibadan
- **Location-Based Search**: Find cars near user's location
- **Pickup/Dropoff**: Flexible location arrangements

#### Availability Management
- **Real-Time Status**: Instant availability updates
- **Booking Conflicts**: Automatic prevention of double bookings
- **Calendar Integration**: Visual availability calendar for owners

### 💳 Payment Integration (Paystack)

#### Supported Payment Methods
- **Debit/Credit Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking via USSD codes
- **Bank Branches**: Physical payment at bank locations

#### Transaction Flow
1. User selects car and dates
2. Total amount calculated (daily rate × days)
3. Secure payment page via Paystack
4. Payment verification and webhook handling
5. Booking confirmation and notifications

### 🔔 Notifications System

#### Real-Time Updates
- **Booking Status**: Payment confirmations, booking approvals
- **Reminders**: Pickup reminders, return deadlines
- **System Alerts**: Maintenance, security notices

#### Delivery Channels
- **In-App**: Real-time notifications within the application
- **Email**: Important updates and confirmations
- **SMS**: Critical alerts and reminders

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API routes with PostgreSQL
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk for secure user management
- **Payments**: Paystack for Nigerian market
- **Storage**: Google Cloud Storage for images and documents
- **Deployment**: Google Cloud Platform (Cloud Run + Cloud SQL)
- **PWA**: Progressive Web App capabilities for mobile experience

## 📱 Progressive Web App Features

- **Offline Capability**: Browse previously viewed cars offline
- **Push Notifications**: Booking updates and reminders
- **Home Screen Installation**: App-like experience on mobile devices
- **Fast Loading**: Optimized for Nigerian network conditions

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Google Cloud Platform account
- Paystack account

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# Payments
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
PAYSTACK_SECRET_KEY=""

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=""
GOOGLE_CLOUD_STORAGE_BUCKET=""

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation
```bash
yarn install
yarn db:generate
yarn db:push
yarn dev
```

## 🚀 Deployment

The application is designed for deployment on Google Cloud Platform:

1. **Cloud Run**: Serverless container deployment for the Next.js application
2. **Cloud SQL**: Managed PostgreSQL database
3. **Cloud Storage**: File storage for images and documents
4. **Cloud CDN**: Global content delivery network
5. **Cloud Build**: Automated CI/CD pipeline

See `deploy/` directory for deployment configurations and GitHub Actions workflow.