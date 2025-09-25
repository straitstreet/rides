# Local Development Setup

## 🚀 Quick Start

Your development server is already running! Visit:
- **Main Site**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard

## 🔧 What's Working Now

✅ **Frontend**: Complete UI with sample data
✅ **Routing**: All pages and dashboards functional
✅ **Components**: Professional design with ShadCN UI
✅ **Responsive**: Mobile and desktop optimized

## 📱 Test Different User Roles

The app shows different content based on user role. To test different roles:

1. Edit `src/lib/auth.ts`
2. Change the `role` field in `getCurrentUser()`:
   - `'admin'` - Access admin portal at `/admin`
   - `'seller'` - See car owner dashboard at `/dashboard`
   - `'buyer'` - See car renter dashboard at `/dashboard`

## 🔐 Optional: Add Real Authentication

To add real authentication with Clerk:

1. **Sign up at [Clerk.com](https://clerk.com)**
2. **Get your API keys**
3. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

## 💳 Optional: Add Payments

To test payments with Paystack:

1. **Sign up at [Paystack.com](https://paystack.com)**
2. **Get your test API keys**
3. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
   PAYSTACK_SECRET_KEY="sk_test_..."
   ```

## 🗄️ Optional: Add Database

For full functionality, set up PostgreSQL:

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
# or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres

# Create database
createdb rides

# Update .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/rides"

# Run migrations
yarn db:generate
yarn db:push
```

### Option 2: Use Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database
4. Update `.env.local` with the connection string

## 🎨 Customization

### Change Branding
- Update logo and colors in `src/app/page.tsx`
- Modify the app name in `package.json`

### Add Your Images
- Replace sample car images in `src/lib/seed-data.ts`
- Use your own Google Cloud Storage bucket or local images

### Modify Content
- Update Nigerian cities in `src/lib/seed-data.ts`
- Customize car categories and features
- Update pricing and currency format

## 📂 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin portal pages
│   ├── dashboard/         # User dashboard pages
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Dashboard components
│   └── ui/                # ShadCN UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts            # Authentication logic
│   ├── db/                # Database schema and connection
│   └── seed-data.ts       # Sample data
```

## 🔄 Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Database commands (when database is set up)
yarn db:generate    # Generate migrations
yarn db:push        # Push schema to database
yarn db:studio      # Open database studio
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
yarn dev -p 3001
```

### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

### Database Connection Issues
- Ensure PostgreSQL is running
- Check connection string in `.env.local`
- Verify database exists

## 🚀 Ready for Production?

When you're ready to deploy:
1. Follow the deployment guide in `deploy/README.md`
2. Use the GCP setup script: `./deploy/setup-gcp.sh`
3. Push to GitHub to trigger automatic deployment

---

**Need help?** Check the main README.md or create an issue in the GitHub repository.