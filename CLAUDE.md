# NAIJA RIDES - Car Rental Platform

**CLAUDE PROJECT OVERVIEW & DEVELOPER GUIDE**

## 🚗 Project Overview

Naija Rides is a comprehensive car rental platform built specifically for the Nigerian market. It's a full-stack Next.js 15 application with TypeScript that connects car owners with renters across major Nigerian cities.

### Key Features
- **Multi-role Authentication**: Admin, Seller (car owners), Buyer (renters) with Clerk
- **Car Listings & Booking**: Full CRUD with real-time availability
- **Payment Integration**: Paystack for Nigerian market (cards, bank transfer, USSD)
- **Review System**: Dual reviews between renters and owners
- **Progressive Web App**: Mobile-optimized with offline capabilities
- **Security-focused**: Comprehensive verification for users and cars
- **Cloud-ready**: Designed for Google Cloud Platform deployment

## 📁 Project Structure

```
/naija-rides/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (legal)/                  # Legal pages (grouped route)
│   │   │   ├── cookies/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── admin/                    # Admin dashboard
│   │   ├── cars/                     # Car browsing page
│   │   ├── dashboard/                # User dashboards
│   │   ├── about/                    # About page
│   │   ├── contact/                  # Contact page
│   │   ├── help/                     # Help center
│   │   ├── list-car/                 # List car for rent
│   │   ├── safety/                   # Safety information
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
│   │   ├── reviews/                  # Review system components
│   │   │   ├── review-card.tsx
│   │   │   ├── review-form.tsx
│   │   │   └── review-summary.tsx
│   │   ├── ui/                       # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   └── [other ui components]
│   │   └── booking-modal.tsx         # Car booking modal
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle ORM schema
│   │   │   └── index.ts              # Database connection
│   │   ├── auth.ts                   # Client-side auth utilities
│   │   ├── auth-server.ts            # Server-side auth utilities
│   │   ├── seed-data.ts              # Sample data & helper functions
│   │   └── utils.ts                  # Utility functions (cn helper)
├── deploy/                           # Deployment configurations
├── drizzle/                          # Database migrations
├── CLAUDE.md                         # This file
├── README.md                         # Project documentation
├── LOCAL_SETUP.md                    # Development setup guide
├── package.json                      # Dependencies and scripts
├── components.json                   # ShadCN UI configuration
├── drizzle.config.ts                 # Database configuration
├── next.config.js                    # Next.js configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🛠 Tech Stack & Dependencies

### Core Framework
- **Next.js 15.5.4**: App Router with RSC, TypeScript support
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Full type safety

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS with custom theme
- **ShadCN UI**: High-quality React components
- **Radix UI**: Accessible primitives (@radix-ui/react-*)
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variants

### Database & ORM
- **PostgreSQL**: Primary database
- **Drizzle ORM 0.36.4**: Type-safe ORM with migrations
- **Drizzle Kit 0.29.1**: Database toolkit

### Authentication & Security
- **Clerk 6.32.2**: Authentication provider with roles
- **Zod 3.23.8**: Schema validation

### Utilities
- **date-fns 4.1.0**: Date manipulation
- **clsx & tailwind-merge**: Conditional classes

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

### Supporting Tables
- `carImages`: Multiple images per car with primary designation
- `notifications`: User notifications system
- `favorites`: User car favorites
- `verificationDocuments`: User verification documents
- `carDocuments`: Car verification documents

## 🎨 UI/UX Design System

### Design Principles
- **Nigerian-focused**: Naira currency, local cities, cultural context
- **Mobile-first**: Optimized for Nigerian mobile usage patterns
- **Clean & Professional**: Minimal design with clear hierarchy
- **Accessible**: Proper ARIA labels, focus management
- **Fast Loading**: Optimized for Nigerian network conditions

### Color Scheme (CSS Variables)
```css
--primary: oklch(0.45 0.15 165);        /* Teal primary color */
--background: oklch(0.99 0.01 120);     /* Off-white background */
--foreground: oklch(0.15 0.05 150);     /* Dark gray text */
--muted: oklch(0.96 0.02 140);          /* Light gray sections */
```

### Typography
- **Sans**: Inter (primary text)
- **Mono**: Space Grotesk (headings, prices, branding)

### Components Pattern
- All UI components use ShadCN/UI as base
- Custom variants with `cva` (class-variance-authority)
- Consistent spacing and sizing system
- Dark mode support (though not active)

## 🔐 Authentication System

### User Roles
```typescript
type UserRole = 'admin' | 'seller' | 'buyer';
```

### Authentication Flow
1. **Development**: Mock user in `src/lib/auth.ts`
2. **Production**: Clerk integration with role-based metadata
3. **Server Components**: Use `src/lib/auth-server.ts`
4. **Client Components**: Use Clerk hooks (`useUser`)

### Role-based Routing
- `admin` → `/admin` (admin dashboard)
- `seller` → `/dashboard` (car owner dashboard)
- `buyer` → `/dashboard` (renter dashboard)

## 💾 Data Patterns

### Seed Data Structure
Located in `src/lib/seed-data.ts`:
- **sampleCars**: Car listings with ratings and reviews
- **sampleReviews**: Detailed reviews with user avatars
- **nigerianCities**: Major cities for location dropdowns
- **carCategories**: Vehicle categories with descriptions
- **Helper functions**: Rating calculations, review summaries

### Current Data Flow
- **Static Data**: Uses seed data for development
- **Real-time**: Designed for database integration
- **Reviews**: Calculated ratings from review data
- **Booking**: Modal-based booking with date selection

## 🚀 Development Workflow

### Package Manager
**Always use Yarn** (not npm):
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn db:push      # Push schema to database
yarn db:generate  # Generate migrations
yarn db:studio    # Open database studio
```

### Code Conventions
- **TypeScript**: Strict mode enabled
- **File Naming**: kebab-case for files, PascalCase for components
- **Component Structure**: Export default function components
- **Styling**: Tailwind classes with `cn()` utility
- **State Management**: React hooks (useState, useEffect)
- **Form Handling**: Controlled components with Zod validation

### Environment Variables
```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# Database
DATABASE_URL="postgresql://..."

# Payments (Paystack)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
PAYSTACK_SECRET_KEY=""

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=""
GOOGLE_CLOUD_STORAGE_BUCKET=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧩 Key Components

### Homepage (`src/app/page.tsx`)
- Hero section with search form
- Car listings grid (first 12 cars)
- "How it works" section
- Authentication integration with Clerk
- Booking modal integration

### Booking Modal (`src/components/booking-modal.tsx`)
- Car summary with image and details
- Date selection (pickup/dropoff)
- Location input for pickup
- Price calculation (daily rate × days)
- Simulated booking process with confirmation

### Review System (`src/components/reviews/`)
- **ReviewCard**: Individual review display
- **ReviewSummary**: Rating breakdown with progress bars
- **ReviewForm**: Review submission form
- Full integration with car listings

### Dashboard Components (`src/components/dashboard/`)
- Role-based dashboard layouts
- Seller dashboard for car owners
- Buyer dashboard for renters
- Shared header and sidebar components

## 🌍 Internationalization & Localization

### Nigerian Market Focus
- **Currency**: Nigerian Naira (₦) formatting
- **Cities**: Major Nigerian cities (Lagos, Abuja, Port Harcourt, etc.)
- **Payment**: Paystack integration for local payment methods
- **Language**: English with Nigerian context

### Location Data
```javascript
const nigerianCities = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Jos', 'Ilorin', 'Owerri', 'Calabar',
  'Enugu', 'Kaduna', 'Zaria', 'Warri', 'Akure'
];
```

## 🔧 Development Guidelines

### When Adding New Features
1. **Update Database Schema**: Add new tables/columns in `src/lib/db/schema.ts`
2. **Create Seed Data**: Add sample data in `src/lib/seed-data.ts`
3. **Build Components**: Use ShadCN UI components as base
4. **Add Types**: Define TypeScript interfaces
5. **Test Roles**: Ensure proper role-based access
6. **Mobile Responsive**: Test on mobile breakpoints

### Component Development
- Use functional components with hooks
- Implement proper TypeScript typing
- Add accessibility attributes (aria-label, etc.)
- Use Tailwind CSS with consistent spacing
- Handle loading and error states
- Test with different user roles

### State Management
- Use React hooks for local state
- Pass props down for component communication
- Consider Context API for global state
- Database integration ready (Drizzle ORM)

## 🚦 Current Status & Next Steps

### ✅ Completed Features
- Complete UI/UX design system
- Authentication scaffolding with Clerk
- Car listings with filtering
- Booking modal with date selection
- Review system with ratings
- Role-based dashboards
- Responsive design
- Sample data integration

### 🚧 In Progress
- Database integration (schema ready)
- Payment processing (Paystack integration)
- Real-time notifications
- File upload for car images
- User verification system

### 📋 Backlog
- Push notifications
- PWA implementation
- Advanced search/filtering
- Calendar availability view
- Admin approval workflows
- Analytics dashboard

## 🔍 Security Considerations

### Data Protection
- User passwords managed by Clerk
- SQL injection prevention with Drizzle ORM
- Input validation with Zod schemas
- CSRF protection with Next.js
- XSS prevention with React's built-in escaping

### File Uploads
- Google Cloud Storage integration
- File type validation
- Size limits enforcement
- Virus scanning (planned)

### Payment Security
- PCI compliance through Paystack
- No card data storage
- Webhook verification
- Transaction logging

## 🎯 Best Practices for This Project

### Code Style
- Use TypeScript strictly
- Follow existing component patterns
- Implement proper error boundaries
- Add loading states for async operations
- Use semantic HTML elements

### Performance
- Optimize images with Next.js Image component
- Implement lazy loading for car listings
- Use React.memo for expensive components
- Minimize bundle size with dynamic imports

### SEO & Accessibility
- Proper meta tags in layout
- Semantic HTML structure
- ARIA labels for screen readers
- Focus management for modals
- Keyboard navigation support

---

## 📖 Additional Resources

- **Main Documentation**: See README.md for deployment guide
- **Local Setup**: See LOCAL_SETUP.md for development setup
- **Database Schema**: Full schema in `src/lib/db/schema.ts`
- **Sample Data**: Comprehensive seed data in `src/lib/seed-data.ts`
- **UI Components**: ShadCN UI documentation
- **Deployment**: Google Cloud Platform setup in `deploy/`

**Last Updated**: January 2025
**Project Version**: 0.1.0
**Framework**: Next.js 15 + TypeScript + Tailwind CSS