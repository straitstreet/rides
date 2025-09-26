'use client';

import { useState, useEffect, useMemo } from 'react';
import { Car, Filter, MapPin, Search, Star, Calendar, Route } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { sampleCars, nigerianCities, nigerianCitiesCoordinates } from '@/lib/seed-data';
import { CityAutocomplete } from '@/components/city-autocomplete';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Helper function to calculate distance between cities using Haversine formula
const calculateDistance = (city1: string, city2: string): number => {
  if (city1 === city2) return 0;

  const coords1 = nigerianCitiesCoordinates[city1];
  const coords2 = nigerianCitiesCoordinates[city2];

  if (!coords1 || !coords2) {
    // Fallback: try to find city in the coordinates mapping with partial match
    const findCity = (searchCity: string) => {
      return Object.keys(nigerianCitiesCoordinates).find(city =>
        city.toLowerCase().includes(searchCity.toLowerCase()) ||
        searchCity.toLowerCase().includes(city.toLowerCase())
      );
    };

    const foundCity1 = findCity(city1);
    const foundCity2 = findCity(city2);

    if (!foundCity1 || !foundCity2) {
      return 0; // Return 0 if cities not found
    }

    return calculateDistance(foundCity1, foundCity2);
  }

  // Haversine formula to calculate distance between two coordinates
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
  const dLon = (coords2.lng - coords1.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers

  return Math.round(distance);
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export default function CarsPage() {
  const searchParams = useSearchParams();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get search parameters from URL
  const urlLocation = searchParams.get('location') || '';
  const urlPickup = searchParams.get('pickup') || '';
  const urlDropoff = searchParams.get('dropoff') || '';

  // Set initial search location from URL
  useEffect(() => {
    setSearchLocation(urlLocation);
  }, [urlLocation]);
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <Car className="h-6 w-6" />
              <span className="font-bold text-lg">Rides</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search cars..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Cars</h1>
              <p className="text-gray-600">Find the perfect car for your next trip across Nigeria</p>
            </div>

            {(urlLocation || urlPickup || urlDropoff) && (
              <div className="mt-4 md:mt-0 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Search criteria:</p>
                <div className="space-y-1 text-sm">
                  {urlLocation && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{urlLocation}</span>
                    </div>
                  )}
                  {urlPickup && urlDropoff && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDateForDisplay(urlPickup)} - {formatDateForDisplay(urlDropoff)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional search/filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <CityAutocomplete
                placeholder="Filter by city..."
                value={searchLocation}
                onChange={setSearchLocation}
                className="h-10"
              />
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by car name or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filtered cars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {useMemo(() => {
            let filteredCars = sampleCars;

            // Filter by location if specified
            if (searchLocation) {
              filteredCars = filteredCars.filter(car => {
                const carCity = car.location.split(',')[0].trim();
                return carCity.toLowerCase().includes(searchLocation.toLowerCase()) ||
                       searchLocation.toLowerCase().includes(carCity.toLowerCase());
              });
            }

            // Filter by search query
            if (searchQuery) {
              filteredCars = filteredCars.filter(car =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
                car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            return filteredCars;
          }, [searchLocation, searchQuery]).map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => window.location.href = `/cars/${car.id}`}
            >
              <CardHeader className="p-0">
                <div className="h-48 relative">
                  <Image
                    src={car.image}
                    alt={`${car.name} - ${car.location}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{car.rating}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{car.location}</span>
                  </div>

                  {/* Show distance if search location is specified */}
                  {searchLocation && (
                    <div className="flex items-center text-gray-500">
                      <Route className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        ~{calculateDistance(searchLocation, car.location.split(',')[0].trim())}km away
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">₦{car.price.toLocaleString()}</span>
                  <span className="text-gray-600">/day</span>
                </div>
                <Button size="sm" onClick={(e) => e.stopPropagation()}>Book Now</Button>
              </CardFooter>
            </Card>
          ))}

          {/* No results message */}
          {useMemo(() => {
            let filteredCars = sampleCars;

            if (searchLocation) {
              filteredCars = filteredCars.filter(car => {
                const carCity = car.location.split(',')[0].trim();
                return carCity.toLowerCase().includes(searchLocation.toLowerCase()) ||
                       searchLocation.toLowerCase().includes(carCity.toLowerCase());
              });
            }

            if (searchQuery) {
              filteredCars = filteredCars.filter(car =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
                car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            return filteredCars.length === 0;
          }, [searchLocation, searchQuery]) && (
            <div className="col-span-full text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available cars.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchLocation('');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}