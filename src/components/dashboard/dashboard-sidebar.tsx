/**
 * Dashboard Sidebar Component
 *
 * This component renders the navigation sidebar for user dashboards (seller/buyer).
 * It provides role-based navigation and responsive design for mobile/desktop.
 *
 * Features:
 * - Role-based navigation items
 * - Active link highlighting
 * - Responsive collapsible design
 * - Badge notifications for important items
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getMockUser } from '@/lib/auth';
import { useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Heart,
  CreditCard,
  User,
  Settings,
  HelpCircle,
  Star,
  FileText,
  TrendingUp,
  Plus
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  roles: ('seller' | 'buyer')[];
}

// Navigation items with role-based visibility
const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['seller', 'buyer'],
  },
  // Seller-specific items
  {
    name: 'My Cars',
    href: '/dashboard/cars',
    icon: Car,
    roles: ['seller'],
  },
  {
    name: 'Add Car',
    href: '/dashboard/cars/add',
    icon: Plus,
    roles: ['seller'],
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
    badge: 3, // Pending requests
    roles: ['seller'],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    roles: ['seller'],
  },
  // Buyer-specific items
  {
    name: 'My Trips',
    href: '/dashboard/trips',
    icon: Calendar,
    roles: ['buyer'],
  },
  {
    name: 'Favorites',
    href: '/dashboard/favorites',
    icon: Heart,
    badge: 5, // Saved cars
    roles: ['buyer'],
  },
  {
    name: 'Search Cars',
    href: '/dashboard/search',
    icon: Car,
    roles: ['buyer'],
  },
  // Common items
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    roles: ['seller', 'buyer'],
  },
  {
    name: 'Reviews',
    href: '/dashboard/reviews',
    icon: Star,
    roles: ['seller', 'buyer'],
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    roles: ['seller', 'buyer'],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['seller', 'buyer'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['seller', 'buyer'],
  },
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle,
    roles: ['seller', 'buyer'],
  },
];

/**
 * DashboardSidebar Component
 *
 * Renders a responsive sidebar navigation with role-based menu items
 * for both seller and buyer users.
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { user: clerkUser } = useUser();

  // Use Clerk user data - only fall back to mock in development
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    role: (clerkUser.publicMetadata?.role as 'admin' | 'seller' | 'buyer') || 'buyer',
    isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
    profileImage: clerkUser.imageUrl,
  } : (process.env.NODE_ENV === 'development' ? getMockUser() : null);

  // Filter navigation items based on user role
  const visibleItems = navigationItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            {/* Sidebar Header */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">Rides</span>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role} Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>

                    {/* Badge for notifications */}
                    {item.badge && (
                      <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Info at Bottom */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay - Implementation would include mobile menu logic */}
      {/* This would be expanded with proper mobile menu state management */}
    </>
  );
}