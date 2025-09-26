'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface InviteValidation {
  valid: boolean;
  invite?: {
    id: string;
    code: string;
    role: string;
    email?: string;
    expiresAt: string;
  };
  error?: string;
}

const RegisterPageContent = () => {
  const searchParams = useSearchParams();
  const { isLoaded } = useSignUp();

  const [inviteCode, setInviteCode] = useState(searchParams.get('code') || '');
  const [inviteValidation, setInviteValidation] = useState<InviteValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInviteCode = async (code: string) => {
    if (!code || code.length < 8) {
      setInviteValidation(null);
      return;
    }

    try {
      setIsValidating(true);
      setError(null);

      const response = await fetch('/api/invites/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteValidation(data);
        if (data.valid) {
          setShowSignUp(true);
        }
      } else {
        setInviteValidation(data);
        setShowSignUp(false);
      }
    } catch (error) {
      console.error('Error validating invite code:', error);
      setInviteValidation({
        valid: false,
        error: 'Failed to validate invite code'
      });
      setShowSignUp(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateInviteCode(inviteCode);
  };

  // TODO: Implement sign up completion handler
  // const handleSignUpComplete = async (userId: string) => {
  //   if (!inviteValidation?.invite) return;

  //   try {
  //     // Mark the invite code as used
  //     await fetch('/api/invites/use', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         code: inviteValidation.invite.code,
  //         userId,
  //       }),
  //     });

  //     // Redirect to appropriate dashboard based on role
  //     const role = inviteValidation.invite.role;
  //     if (role === 'admin') {
  //       router.push('/admin');
  //     } else {
  //       router.push('/dashboard');
  //     }
  //   } catch (error) {
  //     console.error('Error marking invite as used:', error);
  //     // Still redirect even if this fails
  //     router.push('/dashboard');
  //   }
  // };

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInviteCode(code);
      validateInviteCode(code);
    }
  }, [searchParams]);

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-orange-100 text-orange-800',
      buyer: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join Naija Rides
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your invite code to create your account
          </p>
        </div>

        {!showSignUp ? (
          /* Invite Code Form */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Invite Code Required
              </CardTitle>
              <CardDescription>
                Naija Rides is currently invite-only. Please enter your invite code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <Input
                    id="invite-code"
                    type="text"
                    placeholder="NAIJA-XXXXXXXX"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="mt-1"
                    required
                  />
                </div>

                {/* Validation Status */}
                {inviteValidation && (
                  <Alert className={inviteValidation.valid ? 'border-primary/20 bg-primary/5' : 'border-red-200 bg-red-50'}>
                    {inviteValidation.valid ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={inviteValidation.valid ? 'text-primary' : 'text-red-700'}>
                      {inviteValidation.valid ? (
                        <div className="space-y-2">
                          <p>✅ Valid invite code!</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span>Role:</span>
                            {getRoleBadge(inviteValidation.invite!.role)}
                          </div>
                          {inviteValidation.invite!.email && (
                            <p className="text-sm">For: {inviteValidation.invite!.email}</p>
                          )}
                        </div>
                      ) : (
                        inviteValidation.error
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isValidating || !inviteCode}
                >
                  {isValidating ? 'Validating...' : 'Validate Invite Code'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an invite code?{' '}
                  <a href="/contact" className="text-blue-600 hover:text-blue-500">
                    Contact us
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Clerk Sign Up Component */
          <div>
            {inviteValidation?.invite && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Registering as:</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(inviteValidation.invite.role)}
                        <span className="text-sm text-gray-600">
                          Code: {inviteValidation.invite.code}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-none',
                  },
                }}
                afterSignUpUrl="/dashboard"
                afterSignInUrl="/dashboard"
              />
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowSignUp(false)}
                className="text-sm"
              >
                Use Different Invite Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RegisterPage = () => {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
};

export default RegisterPage;