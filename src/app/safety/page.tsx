'use client';

import { Car, Shield, UserCheck, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SafetyPage() {
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
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Safety is Our Priority</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;ve implemented comprehensive safety measures to ensure every trip is secure and every interaction is trustworthy.
          </p>
        </div>

        {/* Safety Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <UserCheck className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>Identity Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                All users must verify their identity with government-issued ID and phone number.
              </p>
              <Badge variant="secondary">Required for All Users</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>Insurance Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Every rental includes comprehensive insurance coverage for peace of mind.
              </p>
              <Badge variant="secondary">Up to ₦10M Coverage</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>GPS Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                All vehicles have GPS tracking for security and roadside assistance.
              </p>
              <Badge variant="secondary">24/7 Monitoring</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Round-the-clock customer support and emergency assistance.
              </p>
              <Badge variant="secondary">Always Available</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Car className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>Vehicle Inspection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Regular safety inspections ensure all vehicles meet our standards.
              </p>
              <Badge variant="secondary">Quarterly Checks</Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle>Incident Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Immediate response team for any incidents or emergencies.
              </p>
              <Badge variant="secondary">Rapid Response</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Safety Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* For Renters */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Safety Tips for Renters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Before Your Trip</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Complete your profile and verify your identity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Review the car owner&apos;s profile and ratings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Check the vehicle details and photos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Communicate through the Rides platform</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">During Your Trip</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Inspect the car before driving away</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Take photos of any existing damage</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Keep emergency contact numbers handy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Follow all traffic laws and drive safely</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Car Owners */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Safety Tips for Car Owners</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Preparing Your Car</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Keep your car clean and well-maintained</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Ensure all safety features work properly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Install and maintain GPS tracking device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Update your listing with accurate information</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Managing Bookings</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Screen potential renters carefully</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Meet in safe, public locations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Document car condition before handover</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Trust your instincts about potential renters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency Situations</h2>
          <p className="text-red-700 mb-6">
            In case of accidents, theft, or other emergencies, contact us immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-red-900">Emergency Hotline</p>
              <p className="text-2xl font-bold text-red-600">199 or +234 911</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-red-900">Rides Support</p>
              <p className="text-2xl font-bold text-red-600">+234 800-HELP</p>
            </div>
          </div>
        </div>

        {/* Trust & Safety Team */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Trust & Safety Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Our dedicated team works around the clock to ensure the safety and security of our community.
            We investigate reports, monitor activity, and continuously improve our safety measures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-colors">
                Report a Safety Issue
              </button>
            </Link>
            <Link href="/help" className="inline-block">
              <button className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-semibold transition-colors">
                Safety Resources
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}