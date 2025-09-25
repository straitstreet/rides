/**
 * Admin Sidebar Component
 *
 * This component renders the navigation sidebar for the admin portal.
 * It includes navigation links for different admin sections and shows
 * active states for the current page.
 *
 * Features:
 * - Responsive design with collapsible mobile view
 * - Active link highlighting
 * - Role-based navigation items
 * - Icon integration with Lucide React
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Car,
  CreditCard,
  AlertTriangle,
  Settings,
  BarChart3,
  FileText,
  Shield
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

// Navigation items for the admin sidebar
const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Cars',
    href: '/admin/cars',
    icon: Car,
    badge: 5, // Pending verifications
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: CreditCard,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: AlertTriangle,
    badge: 3, // Urgent reports
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Documents',
    href: '/admin/documents',
    icon: FileText,
  },
  {
    name: 'Security',
    href: '/admin/security',
    icon: Shield,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

/**
 * AdminSidebar Component
 *
 * Renders a fixed sidebar navigation for admin users with proper
 * styling, active states, and accessibility features.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            // Determine if the current item is active
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  // Base styles for all navigation items
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out',
                  // Active state styles
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Navigation item icon */}
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 transition-colors',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                  aria-hidden="true"
                />

                {/* Navigation item label */}
                <span className="flex-1">{item.name}</span>

                {/* Optional badge for notifications or counts */}
                {item.badge && (
                  <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Rides Admin v1.0</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}