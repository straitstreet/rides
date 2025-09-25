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

export const getCurrentUser = (): User | null => {
  // This will be replaced with actual Clerk integration
  return {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin', // Change this to test different roles: 'admin', 'seller', 'buyer'
    isVerified: true,
    profileImage: undefined
  };
};

export const checkRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};