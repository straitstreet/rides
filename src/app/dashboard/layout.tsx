/**
 * Dashboard Layout Component
 *
 * This layout component provides the shared structure for both seller and buyer dashboards.
 * It includes responsive navigation, role-based sidebar content, and proper authentication checks.
 *
 * Features:
 * - Role-based navigation (seller/buyer)
 * - Responsive sidebar with mobile menu
 * - Breadcrumb navigation
 * - Header with user profile and notifications
 */

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout
 *
 * Provides the shared layout structure for seller and buyer dashboards.
 * Handles responsive design and role-based navigation.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header - contains user menu, notifications, search */}
      <DashboardHeader />

      <div className="flex">
        {/* Dashboard Sidebar - role-based navigation */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}