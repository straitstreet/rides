'use client';

import { Car } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg mb-6">Last updated: December 2024</p>

          <p>
            Welcome to Rides. These Terms of Service govern your use of our car rental platform.
            By using Rides, you agree to these terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Rides, you accept and agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Platform Services</h2>
          <p>
            Rides provides a platform connecting car owners with renters. We facilitate bookings,
            payments, and communication but are not responsible for the vehicles themselves.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect other users and their property</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Booking and Payment</h2>
          <p>
            All bookings are subject to availability and owner approval. Payments are processed
            securely through our integrated payment system powered by Paystack.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cancellation Policy</h2>
          <p>
            Cancellations may be subject to fees depending on timing and circumstances.
            Please review our cancellation policy before booking.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            Rides provides the platform as-is and disclaims liability for disputes between users,
            vehicle condition, or incidents during rental periods.
          </p>

          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Questions?</h3>
            <p>
              If you have questions about these terms, please contact us at{' '}
              <Link href="/contact" className="text-primary hover:underline">
                legal@rides.ng
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}