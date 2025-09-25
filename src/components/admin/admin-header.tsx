/**
 * Admin Header Component
 *
 * This component renders the top navigation header for the admin portal.
 * It includes user information, notifications, search functionality,
 * and quick access menu items.
 *
 * Features:
 * - User profile dropdown menu
 * - Notification center with badge
 * - Global search functionality
 * - Responsive design for mobile/desktop
 * - Role-based content display
 */

'use client';

import { useState } from 'react';
import { Bell, Search, Menu, LogOut, User, Settings } from 'lucide-react';
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

/**
 * AdminHeader Component
 *
 * Renders the header navigation bar for admin users with profile management,
 * notifications, and search functionality.
 */
export function AdminHeader() {
  // Get current user information (will be replaced with actual auth)
  const user = getMockUser();

  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock notification count (will be replaced with real data)
  const notificationCount = 5;

  /**
   * Handle user logout
   * This will be replaced with actual authentication logout logic
   */
  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement actual logout logic here
  };

  /**
   * Handle search functionality
   * This will be replaced with actual search implementation
   */
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement actual search logic here
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu button and search */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Mobile menu button - only visible on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Global search */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="search"
                placeholder="Search users, cars, bookings..."
                className="pl-10 pr-4 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
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
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profileImage}
                      alt={`${user?.firstName} ${user?.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* User information */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1">
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Profile menu items */}
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}