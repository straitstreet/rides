'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Car, MapPin, Star, Calendar, Clock, Shield, Users, Fuel, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { sampleCars, getCarReviews, getCarReviewSummary } from '@/lib/seed-data';
import { BookingModal } from '@/components/booking-modal';
import { ReviewCard } from '@/components/reviews/review-card';
import { ReviewSummary } from '@/components/reviews/review-summary';
import Link from 'next/link';
import Image from 'next/image';

interface CarDetailsProps {
  params: Promise<{ id: string }>;
}

export default function CarDetailsPage({ params }: CarDetailsProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [carId, setCarId] = useState<string>('');

  // Handle async params in Next.js 15
  useEffect(() => {
    params.then(({ id }) => setCarId(id));
  }, [params]);

  const car = sampleCars.find(c => c.id === carId);

  // Loading state while waiting for params
  if (!carId) {
    return <div>Loading...</div>;
  }

  if (!car) {
    notFound();
  }

  const reviews = getCarReviews(car.id);
  const reviewSummary = getCarReviewSummary(car.id);

  const handleBookCar = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <Car className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold font-mono text-gray-900 tracking-tight">rides</span>
              </Link>
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">back to cars</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Car Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={car.image}
                alt={`${car.name} - ${car.location}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-1 shadow-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">{car.rating}</span>
                <span className="text-xs text-gray-600">({car.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Car Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">
                    {car.name.toLowerCase()}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{car.location.toLowerCase()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 font-mono">
                    ₦{car.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">/day</div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {car.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Car Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center font-mono text-lg">
                  <Settings className="h-5 w-5 mr-2" />
                  specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Car className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium text-sm text-gray-900">{car.year}</div>
                    <div className="text-xs text-gray-600">Year</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium text-sm text-gray-900">
                      {car.features.find(f => f.includes('Seat'))?.replace(' Seats', '') || '4'} seats
                    </div>
                    <div className="text-xs text-gray-600">Capacity</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Fuel className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium text-sm text-gray-900">
                      {car.features.find(f => ['Petrol', 'Diesel', 'Hybrid', 'Electric'].includes(f)) || 'Petrol'}
                    </div>
                    <div className="text-xs text-gray-600">Fuel Type</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium text-sm text-gray-900">
                      {car.features.find(f => ['Manual', 'Automatic'].includes(f)) || 'Automatic'}
                    </div>
                    <div className="text-xs text-gray-600">Transmission</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-mono mb-6">
                reviews ({reviewSummary.totalReviews})
              </h2>

              {reviewSummary.totalReviews > 0 && (
                <>
                  <ReviewSummary
                    averageRating={reviewSummary.averageRating}
                    totalReviews={reviewSummary.totalReviews}
                    ratingBreakdown={reviewSummary.ratingBreakdown}
                  />
                  <div className="space-y-4 mt-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </>
              )}

              {reviewSummary.totalReviews === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this car after booking.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Legal & Safety Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center font-mono text-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  safety & legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Valid Nigerian driver&apos;s license required</li>
                    <li>• Minimum age: 21 years</li>
                    <li>• Valid government-issued ID (NIN, Passport, or Driver&apos;s License)</li>
                    <li>• Security deposit required (refundable)</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Insurance & Protection</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Comprehensive insurance coverage included</li>
                    <li>• 24/7 roadside assistance</li>
                    <li>• Damage protection up to ₦500,000</li>
                    <li>• Theft protection included</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Fuel tank must be returned at same level</li>
                    <li>• Late return fee: ₦2,000 per hour</li>
                    <li>• Smoking strictly prohibited</li>
                    <li>• Maximum mileage: 200km per day (additional charges apply)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 font-mono">
                      ₦{car.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">/day</div>
                  </div>

                  <Button
                    onClick={handleBookCar}
                    className="w-full h-12 text-lg font-medium mb-4"
                    size="lg"
                  >
                    book this car
                  </Button>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Instant booking available</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Free cancellation up to 24hrs</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>Fully insured & protected</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="text-xs text-gray-500 text-center">
                    By booking, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        car={car}
      />
    </div>
  );
}