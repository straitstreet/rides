/**
 * Dashboard Header Component
 *
 * This component renders the top navigation header for user dashboards (seller/buyer).
 * It includes search functionality, notifications, and user profile menu.
 *
 * Features:
 * - Global search functionality
 * - Notification center with badge
 * - User profile dropdown
 * - Mobile-responsive design
 * - Role-specific quick actions
 */

'use client';

import { useState } from 'react';
import { Bell, Search, Menu, Plus, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getMockUser } from '@/lib/auth';
import { useUser, useClerk } from '@clerk/nextjs';

/**
 * DashboardHeader Component
 *
 * Renders the header navigation for dashboard users with search,
 * notifications, and user profile management.
 */
export function DashboardHeader() {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Mock data - replace with real API calls
  const notificationCount = 3;

  /**
   * Handle search functionality
   */
  const handleSearch = (query: string) => {
    console.log('Dashboard search:', query);
    // Implement search logic based on user role
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    if (clerkUser) {
      signOut({ redirectUrl: '/' });
    } else {
      console.log('Logout clicked - using mock user');
    }
  };

  /**
   * Get role-specific quick action button
   */
  const getRoleSpecificAction = () => {
    if (user?.role === 'seller') {
      return (
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Car
        </Button>
      );
    } else if (user?.role === 'buyer') {
      return (
        <Button size="sm">
          <Search className="mr-2 h-4 w-4" />
          Find Cars
        </Button>
      );
    }
    return null;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu and branding */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile branding - shown when sidebar is hidden */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rides</span>
            </div>
          </div>

          {/* Center - Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="search"
                placeholder={
                  user?.role === 'seller'
                    ? 'Search your cars, bookings...'
                    : 'Search cars, trips, favorites...'
                }
                className="pl-10 pr-4 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Right side - Actions, notifications, and user menu */}
          <div className="flex items-center space-x-3">
            {/* Role-specific quick action */}
            <div className="hidden sm:block">
              {getRoleSpecificAction()}
            </div>

            {/* Messages/Support */}
            <Button variant="ghost" size="sm" aria-label="Messages">
              <MessageSquare className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                aria-label={`Notifications (${notificationCount} unread)`}
              >
                <Bell className="h-5 w-5" />

                {/* Notification badge */}
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.profileImage}
                      alt={`${user?.firstName} ${user?.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* User information */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="w-fit capitalize">
                        {user?.role}
                      </Badge>
                      {user?.isVerified && (
                        <Badge variant="outline" className="text-primary border-primary">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Profile menu items */}
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>

                {/* Role-specific menu items */}
                {user?.role === 'seller' && (
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add New Car</span>
                  </DropdownMenuItem>
                )}

                {user?.role === 'buyer' && (
                  <DropdownMenuItem>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Browse Cars</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="search"
              placeholder={
                user?.role === 'seller'
                  ? 'Search your cars, bookings...'
                  : 'Search cars, trips...'
              }
              className="pl-10 pr-4 w-full"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}