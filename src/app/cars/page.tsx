'use client';

import { Car, Filter, MapPin, Search, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { sampleCars } from '@/lib/seed-data';
import Link from 'next/link';
import Image from 'next/image';

export default function CarsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Cars</h1>
          <p className="text-gray-600">Find the perfect car for your next trip across Nigeria</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleCars.map((car) => (
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
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{car.location}</span>
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
        </div>
      </div>
    </div>
  );
}