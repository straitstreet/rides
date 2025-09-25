'use client';

import { useState } from 'react';
import { Calendar, MapPin, Star, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CarLocationMap, LocationAutocomplete } from '@/components/maps';
import Image from 'next/image';

interface Car {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  features: string[];
  image: string;
  make: string;
  model: string;
  year: number;
  category: string;
  description: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

export function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 1;
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    return car.price * calculateDays();
  };

  const handleSubmit = async () => {
    if (!car || !pickupDate || !dropoffDate || !pickupLocation) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert(`Booking confirmed for ${car.name}!

📅 Duration: ${calculateDays()} day${calculateDays() > 1 ? 's' : ''}
💰 Total Cost: ₦${calculateTotal().toLocaleString()}
📍 Pickup: ${pickupLocation}
📞 We'll contact you shortly with further details.`);

    setIsSubmitting(false);
    onClose();
  };

  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="font-mono">book your ride</span>
          </DialogTitle>
          <DialogDescription>
            Complete the details below to book {car.name.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Summary */}
          <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-24 h-18 flex-shrink-0">
              <Image
                src={car.image}
                alt={car.name}
                fill
                className="object-cover rounded"
                sizes="96px"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold font-mono">{car.name.toLowerCase()}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{car.location.toLowerCase()}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{car.rating} ({car.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {car.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary font-mono">₦{car.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500">/day</div>
            </div>
          </div>

          {/* Car Location Map */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">car location</Label>
            <CarLocationMap
              location={car.location}
              className="h-48 w-full rounded-lg"
              zoom={12}
            />
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-date">pickup date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="pickup-date"
                  type="date"
                  className="pl-10"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoff-date">drop-off date *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dropoff-date"
                  type="date"
                  className="pl-10"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-location">pickup location *</Label>
            <LocationAutocomplete
              placeholder="where would you like to pickup the car?"
              value={pickupLocation}
              onChange={(value, place) => {
                setPickupLocation(value);
                if (place) {
                  console.log('Pickup location selected:', place);
                }
              }}
              bias="nigeria"
            />
          </div>

          {/* Price Summary */}
          {(pickupDate && dropoffDate) && (
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold font-mono">pricing breakdown</h4>
              <div className="flex justify-between text-sm">
                <span>₦{car.price.toLocaleString()} × {calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                <span>₦{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>total cost</span>
                <span className="text-primary">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !pickupDate || !dropoffDate || !pickupLocation}
            className="sm:flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>booking...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>book now</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}