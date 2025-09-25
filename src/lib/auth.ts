/**
 * Authentication utilities and types
 *
 * This module provides authentication helpers using Clerk.
 * It includes role-based access control and user management utilities.
 */

import { currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'seller' | 'buyer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  profileImage?: string;
}

/**
 * Get the current authenticated user
 * For client components, use useUser() from @clerk/nextjs
 * For server components, use this function
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await currentUser();

    if (!user) return null;

    // Get role from user metadata, default to 'buyer'
    const role = (user.publicMetadata?.role as UserRole) || 'buyer';

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role,
      isVerified: user.emailAddresses[0]?.verification?.status === 'verified',
      profileImage: user.imageUrl,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * For client-side use - Mock user for development
 * In production, use useUser() from @clerk/nextjs
 */
export const getMockUser = (): User => {
  return {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'seller', // Change this to test different roles: 'admin', 'seller', 'buyer'
    isVerified: true,
    profileImage: undefined
  };
};

/**
 * Check if user has required role
 */
export const checkRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

/**
 * Role-based redirect helper
 */
export const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'seller':
    case 'buyer':
      return '/dashboard';
    default:
      return '/';
  }
};