'use client';

import { Car, Upload, MapPin, Calendar, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ListCarPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Car</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Turn your car into a source of income. Join thousands of car owners earning money on Rides.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Earn Extra Income</h3>
            <p className="text-gray-600 text-sm">Make ₦15,000 - ₦50,000 per month by sharing your car</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Full Insurance Coverage</h3>
            <p className="text-gray-600 text-sm">Your car is protected with comprehensive insurance</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-gray-600 text-sm">Set your own availability and pricing</p>
          </div>
        </div>

        {/* Listing Form */}
        <Card>
          <CardHeader>
            <CardTitle>Car Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="e.g., Toyota" />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g., Camry" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="2020" />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="e.g., Black" />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="location" className="pl-10" placeholder="City, State" />
              </div>
            </div>

            <div>
              <Label htmlFor="price">Daily Rate (₦)</Label>
              <Input id="price" type="number" placeholder="15000" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your car, its features, and any special instructions..."
                rows={4}
              />
            </div>

            <div>
              <Label>Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload photos of your car</p>
                <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
              </div>
            </div>

            <Button className="w-full" size="lg">
              List My Car
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By listing your car, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}