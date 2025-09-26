'use client';

import { useState } from 'react';
import { Car, MapPin, Calendar, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MultipleImageUpload } from '@/components/ui/multiple-image-upload';
import { useCarImages } from '@/hooks/use-car-images';
import Link from 'next/link';

export default function ListCarPage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    location: '',
    price: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNewImages, newImages, error: imageError, clearError } = useCarImages({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImagesChange = (files: File[], primaryIndex?: number) => {
    addNewImages(files, primaryIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newImages.length === 0) {
      alert('Please upload at least one image of your car');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create car listing
      const carResponse = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          dailyRate: parseFloat(formData.price),
          fuelType: 'petrol', // Default - could be a form field
          transmission: 'automatic', // Default - could be a form field
          seats: 5, // Default - could be a form field
          category: 'economy', // Default - could be a form field
          plateNumber: 'TEMP-' + Date.now(), // Temporary - should be a form field
        }),
      });

      if (!carResponse.ok) {
        throw new Error('Failed to create car listing');
      }

      const { car } = await carResponse.json();

      // Upload images
      const formDataForImages = new FormData();
      newImages.forEach((file, index) => {
        formDataForImages.append(`image${index}`, file);
      });
      formDataForImages.append('primaryImageIndex', '0');

      const imageResponse = await fetch(`/api/cars/${car.id}/images`, {
        method: 'POST',
        body: formDataForImages,
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to upload images');
      }

      alert('Car listed successfully!');
      // Redirect to dashboard or car listing
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error listing car:', error);
      alert(error instanceof Error ? error.message : 'Failed to list car');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Camry"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2020"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Black"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    className="pl-10"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Daily Rate (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your car, its features, and any special instructions..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Car Photos *</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Upload up to 10 high-quality photos of your car. The first photo will be used as the main image.
                </p>

                {imageError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{imageError}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}

                <MultipleImageUpload
                  onImagesChange={handleImagesChange}
                  maxImages={10}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || newImages.length === 0}
              >
                {isSubmitting ? 'Listing Car...' : 'List My Car'}
              </Button>

              {newImages.length === 0 && (
                <p className="text-sm text-amber-600 text-center">
                  Please upload at least one photo of your car to continue
                </p>
              )}
            </form>
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