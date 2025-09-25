'use client';

import { Car, Search, HelpCircle, Book, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <Car className="h-6 w-6" />
            <span className="font-bold text-lg">Rides</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <Button>Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Support</h3>
              <p className="text-gray-600 mb-4">Speak directly with our team</p>
              <Button variant="outline">+234 800-RIDES</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Book className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">User Guides</h3>
              <p className="text-gray-600 mb-4">Step-by-step instructions</p>
              <Button variant="outline">View Guides</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Renters */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">For Renters</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/how-to-book" className="block text-primary hover:underline">
                    How to book a car
                  </Link>
                  <Link href="/help/account-verification" className="block text-primary hover:underline">
                    Account verification process
                  </Link>
                  <Link href="/help/age-requirements" className="block text-primary hover:underline">
                    Age and license requirements
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking & Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/payment-methods" className="block text-primary hover:underline">
                    Accepted payment methods
                  </Link>
                  <Link href="/help/booking-changes" className="block text-primary hover:underline">
                    Modifying or canceling bookings
                  </Link>
                  <Link href="/help/pricing" className="block text-primary hover:underline">
                    How pricing works
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">During Your Trip</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/car-pickup" className="block text-primary hover:underline">
                    Car pickup process
                  </Link>
                  <Link href="/help/roadside-assistance" className="block text-primary hover:underline">
                    Roadside assistance
                  </Link>
                  <Link href="/help/extending-trip" className="block text-primary hover:underline">
                    Extending your trip
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Car Owners */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">For Car Owners</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/list-your-car" className="block text-primary hover:underline">
                    How to list your car
                  </Link>
                  <Link href="/help/car-requirements" className="block text-primary hover:underline">
                    Car eligibility requirements
                  </Link>
                  <Link href="/help/verification-documents" className="block text-primary hover:underline">
                    Required documentation
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Managing Bookings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/approve-bookings" className="block text-primary hover:underline">
                    Approving booking requests
                  </Link>
                  <Link href="/help/pricing-calendar" className="block text-primary hover:underline">
                    Setting prices and availability
                  </Link>
                  <Link href="/help/guest-communication" className="block text-primary hover:underline">
                    Communicating with guests
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Earnings & Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help/earnings-payouts" className="block text-primary hover:underline">
                    How earnings and payouts work
                  </Link>
                  <Link href="/help/car-protection" className="block text-primary hover:underline">
                    Car protection plans
                  </Link>
                  <Link href="/help/damage-claims" className="block text-primary hover:underline">
                    Filing damage claims
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Learn More About Rides</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}