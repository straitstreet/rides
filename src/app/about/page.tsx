'use client';

import { Car, Users, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Rides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re revolutionizing car rental in Nigeria by connecting car owners with travelers,
            creating opportunities and making transportation more accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Built by Nigerians, for Nigerians. We understand the unique transportation needs across our diverse country.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Safety First</h3>
              <p className="text-gray-600">
                Every car is inspected, every user is verified, and every trip is insured for your peace of mind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Fleet</h3>
              <p className="text-gray-600">
                From economy to luxury, our diverse fleet ensures there&apos;s a perfect car for every journey and budget.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Local Impact</h3>
              <p className="text-gray-600">
                Every rental supports local car owners and strengthens communities across Nigeria.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg mx-auto text-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="mb-6">
            Founded in 2024, Rides emerged from a simple observation: Nigeria has countless car owners
            who could benefit from extra income, and travelers who need reliable, affordable transportation.
            Traditional car rental companies often fall short of meeting diverse needs across our vast country.
          </p>

          <p className="mb-6">
            We built Rides to bridge this gap, creating a platform where car owners can monetize their
            vehicles safely and travelers can access quality cars at competitive prices. Our peer-to-peer
            model benefits everyone while building stronger communities.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="mb-6">
            To make transportation more accessible, affordable, and community-driven across Nigeria.
            We believe in empowering individuals while creating seamless travel experiences that
            connect people and places.
          </p>

          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Join Our Journey</h3>
            <p className="text-gray-700">
              Whether you&apos;re a car owner looking to earn extra income or a traveler seeking your next adventure,
              Rides is here to support your goals. Together, we&apos;re building the future of transportation in Nigeria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}