'use client';

import { useState } from 'react';
import { Car, MapPin, Search, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { sampleCars } from '@/lib/seed-data';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { BookingModal } from '@/components/booking-modal';
import { LocationAutocomplete } from '@/components/maps';
// Helper function for role-based redirects
const getRoleBasedRedirect = (role: 'admin' | 'seller' | 'buyer') => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'seller':
    case 'buyer':
      return '/dashboard';
    default:
      return '/';
  }
};
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [selectedCar, setSelectedCar] = useState<typeof sampleCars[0] | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for cars:', { pickupLocation, pickupDate, dropoffDate });
  };

  const handleBookCar = (carId: string) => {
    const car = sampleCars.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsBookingModalOpen(true);
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <Car className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-mono text-gray-900 tracking-tight">rides</span>
            </div>
            <div className="flex items-center space-x-3">
              {isLoaded && user ? (
                <>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                        userButtonPopoverCard: "shadow-xl",
                      },
                    }}
                  />
                  <Button size="sm" asChild>
                    <Link href={getRoleBasedRedirect((user.publicMetadata?.role as 'admin' | 'seller' | 'buyer') || 'buyer')}>
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Get Started</Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Compact Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-mono tracking-tight leading-tight">
            rent cars anywhere in <span className="text-primary bg-primary/5 px-2 py-1 rounded-lg">nigeria</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            find the perfect ride from trusted owners across the country.
          </p>

          {/* Compact Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <LocationAutocomplete
                placeholder="where?"
                value={pickupLocation}
                onChange={(value, place) => {
                  setPickupLocation(value);
                  if (place) {
                    console.log('Selected place:', place);
                  }
                }}
                className="h-10 text-sm"
                bias="nigeria"
              />
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  type="date"
                  className="pl-9 h-10 text-sm"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  aria-label="Pick-up date"
                  placeholder="from when?"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  type="date"
                  className="pl-9 h-10 text-sm"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  aria-label="Drop-off date"
                  placeholder="until when?"
                />
              </div>
              <Button
                className="h-10"
                onClick={handleSearch}
                aria-label="Search for available cars"
              >
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                find cars
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Cars Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-mono tracking-tight">available now</h2>
          <p className="text-gray-600">
            browse cars ready for your next adventure
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="grid" aria-label="Available cars">
          {sampleCars.slice(0, 12).map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 group flex flex-col" role="gridcell">
              <CardHeader className="p-0">
                <div className="h-36 relative bg-gray-100">
                  <Image
                    src={car.image}
                    alt={`${car.name} - ${car.location}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 flex-1 flex flex-col justify-between min-h-[100px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm font-mono truncate pr-2 flex-1">{car.name.toLowerCase()}</h3>
                    <div className="flex items-center space-x-1 flex-shrink-0" aria-label={`Rating: ${car.rating} out of 5 stars`}>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" aria-hidden="true" />
                      <span className="text-xs text-gray-600">{car.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs truncate">{car.location.toLowerCase()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex-1">
                    <div className="text-base font-bold text-primary font-mono" aria-label={`Price: ${car.price.toLocaleString()} naira per day`}>
                      ₦{car.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">/day</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleBookCar(car.id)}
                    aria-label={`Book ${car.name} now`}
                    className="text-xs px-3 py-1 h-7 flex-shrink-0"
                  >
                    book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/cars">view all cars</Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-mono tracking-tight">how it works</h2>
            <p className="text-gray-600">
              three simple steps to get on the road
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "browse & select",
                description: "find your perfect ride from verified listings"
              },
              {
                step: "02",
                title: "book & pay",
                description: "secure booking with safe payment via paystack"
              },
              {
                step: "03",
                title: "drive & enjoy",
                description: "pick up and hit the road with 24/7 support"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center text-lg font-mono font-bold mx-auto mb-3" aria-label={`Step ${item.step}`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2 font-mono">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        car={selectedCar}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-lg font-bold font-mono">rides</span>
              </div>
              <p className="text-gray-400 text-sm">
                nigeria&apos;s trusted car rental platform connecting owners with travelers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-mono text-sm">company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">about us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-mono text-sm">support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">help center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">contact us</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-mono text-sm">legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">terms of service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">privacy policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">cookie policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 rides. all rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
