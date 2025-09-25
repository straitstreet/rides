/**
 * Server-side authentication utilities
 *
 * This module should only be used in server components and API routes.
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
 * Get the current authenticated user (server-side only)
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await currentUser();

    if (!user) return null;

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