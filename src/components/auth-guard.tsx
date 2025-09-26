'use client';

import { useUser } from '@clerk/nextjs';
import { isEmailAllowed } from '@/lib/allowlist';
import { UnauthorizedAccess } from '@/components/unauthorized-access';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is not signed in, show the children (homepage with sign-in)
  if (!isSignedIn) {
    return <>{children}</>;
  }

  // If user is signed in, check if their email is allowed
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail || !isEmailAllowed(userEmail)) {
    return <UnauthorizedAccess userEmail={userEmail} />;
  }

  // User is authorized, show the app
  return <>{children}</>;
}