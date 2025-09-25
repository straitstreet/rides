'use client';

import { Car, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg mb-6">Last updated: December 2024</p>

          <p>
            At Rides, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, and protect your information when you use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Profile photos and identification documents</li>
            <li>Payment information (processed securely by Paystack)</li>
            <li>Driver&apos;s license and vehicle registration details</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Usage Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Booking and rental history</li>
            <li>Location data for pickups and drop-offs</li>
            <li>Device and browser information</li>
            <li>Communication between users through our platform</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitate car rentals and bookings</li>
            <li>Process payments and resolve billing issues</li>
            <li>Verify user identity and ensure platform safety</li>
            <li>Provide customer support and resolve disputes</li>
            <li>Send important updates about bookings and account activity</li>
            <li>Improve our services and develop new features</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With other users as necessary for bookings (e.g., contact information)</li>
            <li>With service providers like payment processors and insurance companies</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with business transfers or acquisitions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information, including
            encryption, secure servers, and regular security audits. However, no method of
            transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services and
            comply with legal obligations. Inactive accounts may be deleted after extended periods.
          </p>

          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or how we handle your data,
              please contact us at{' '}
              <Link href="/contact" className="text-primary hover:underline">
                privacy@rides.ng
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}