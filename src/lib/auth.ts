/**
 * Client-side authentication utilities
 *
 * This module provides authentication helpers for client components.
 */

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