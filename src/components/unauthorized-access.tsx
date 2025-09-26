'use client';

import { SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UnauthorizedAccessProps {
  userEmail?: string;
}

export function UnauthorizedAccess({ userEmail }: UnauthorizedAccessProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Access Restricted
            </h1>
            <p className="text-muted-foreground">
              Naija Rides is currently in early access. Your email address needs to be allowlisted to access the application.
            </p>
          </div>

          {userEmail && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Signed in as:
              </p>
              <p className="font-medium text-foreground">{userEmail}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error or would like to request access, please contact our team.
            </p>

            <div className="flex flex-col gap-3">
              <SignOutButton>
                <Button variant="outline" className="w-full">
                  Sign Out
                </Button>
              </SignOutButton>

              <Button
                variant="ghost"
                className="w-full text-primary hover:text-primary/80"
                onClick={() => window.open('mailto:support@rides.ng?subject=Access Request', '_blank')}
              >
                Request Access
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Thank you for your interest in Naija Rides. We'll be opening access to more users soon!
          </p>
        </div>
      </Card>
    </div>
  );
}