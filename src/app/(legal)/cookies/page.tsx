'use client';

import { Car, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
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
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg mb-6">Last updated: December 2024</p>

          <p>
            This Cookie Policy explains how Rides uses cookies and similar technologies on our website and mobile application.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit our website. They help us provide
            a better user experience by remembering your preferences and improving our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
          <p>These cookies are necessary for our website to function properly and cannot be disabled:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authentication cookies to keep you logged in</li>
            <li>Session cookies for booking processes</li>
            <li>Security cookies to protect against fraud</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Functional Cookies</h3>
          <p>These cookies enhance your experience by remembering your choices:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Language and location preferences</li>
            <li>Search filters and sorting preferences</li>
            <li>Display settings and accessibility options</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics Cookies</h3>
          <p>These help us understand how you use our website to improve our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Page views and user behavior tracking</li>
            <li>Performance monitoring and error reporting</li>
            <li>A/B testing for feature improvements</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Marketing Cookies</h3>
          <p>These cookies help us show you relevant advertisements:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Targeted advertising based on your interests</li>
            <li>Social media integration</li>
            <li>Conversion tracking for marketing campaigns</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. However, disabling certain cookies
            may affect your ability to use some features of our website.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Browser Settings</h3>
          <p>Most browsers allow you to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>View and delete existing cookies</li>
            <li>Block cookies from specific websites</li>
            <li>Block third-party cookies</li>
            <li>Delete all cookies when closing the browser</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
          <p>
            We use services from trusted third parties that may set their own cookies, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Analytics for website analytics</li>
            <li>Clerk for authentication services</li>
            <li>Paystack for payment processing</li>
            <li>Social media platforms for sharing features</li>
          </ul>

          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Questions About Cookies?</h3>
            <p>
              If you have questions about our use of cookies, please contact us at{' '}
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