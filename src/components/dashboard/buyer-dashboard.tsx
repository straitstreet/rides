/**
 * Buyer Dashboard Component
 *
 * This component displays the main dashboard for car renters/buyers.
 * It shows rental history, upcoming trips, favorite cars, and quick booking actions.
 *
 * Features:
 * - Upcoming and past trip management
 * - Favorite cars collection
 * - Booking history and receipts
 * - Quick search and booking
 * - Trip planning tools
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Heart,
  Search,
  Clock,
  Star,
  CreditCard,
  Navigation
} from 'lucide-react';
import type { User } from '@/lib/auth';
import { sampleCars } from '@/lib/seed-data';
import Image from 'next/image';

interface BuyerDashboardProps {
  user: User;
}

/**
 * Buyer Dashboard Component
 *
 * Main dashboard view for car renters showing their trips,
 * favorites, and booking history.
 */
export function BuyerDashboard({ user }: BuyerDashboardProps) {
  // Sample data - will be replaced with real API calls
  const stats = [
    {
      title: 'Trips Completed',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Navigation,
      description: 'This year',
    },
    {
      title: 'Upcoming Trips',
      value: '2',
      change: '+1',
      trend: 'up',
      icon: Calendar,
      description: 'Next 30 days',
    },
    {
      title: 'Favorite Cars',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Heart,
      description: 'Saved for later',
    },
    {
      title: 'Total Spent',
      value: '₦340K',
      change: '+45K',
      trend: 'up',
      icon: CreditCard,
      description: 'This year',
    },
  ];

  // Sample upcoming trips data
  const upcomingTrips = [
    {
      id: 1,
      carName: 'Toyota Camry 2022',
      location: 'Lekki, Lagos',
      startDate: '2024-01-20',
      endDate: '2024-01-23',
      amount: 45000,
      status: 'confirmed',
      image: sampleCars[0].image,
      ownerName: 'John Adebayo',
    },
    {
      id: 2,
      carName: 'Mercedes-Benz GLE 2022',
      location: 'Victoria Island, Lagos',
      startDate: '2024-02-05',
      endDate: '2024-02-08',
      amount: 135000,
      status: 'pending_payment',
      image: sampleCars[4].image,
      ownerName: 'Sarah Okonkwo',
    },
  ];

  // Sample recent trips data
  const recentTrips = [
    {
      id: 1,
      carName: 'Honda Accord 2021',
      location: 'Wuse, Abuja',
      startDate: '2024-01-10',
      endDate: '2024-01-13',
      amount: 54000,
      status: 'completed',
      rating: 5,
      image: sampleCars[1].image,
      ownerName: 'Ahmed Musa',
    },
    {
      id: 2,
      carName: 'Kia Rio 2020',
      location: 'Ikeja, Lagos',
      startDate: '2024-01-05',
      endDate: '2024-01-07',
      amount: 24000,
      status: 'completed',
      rating: 4,
      image: sampleCars[3].image,
      ownerName: 'Grace Okoro',
    },
  ];

  // Sample favorite cars
  const favoriteCars = sampleCars.slice(0, 3);

  /**
   * Get status color based on trip/booking status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary/10 text-primary';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Render star rating
   */
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Ready for your next adventure? Here are your upcoming trips and favorites.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search Cars
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Plan Trip
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-primary' : 'text-red-600'}`}>
                    {stat.change} {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.trend === 'up' ? 'bg-primary/10' : 'bg-red-100'}`}>
                  <stat.icon className={`h-6 w-6 ${stat.trend === 'up' ? 'text-primary' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Trips</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  {/* Car Image */}
                  <div className="w-20 h-15 relative rounded-md overflow-hidden">
                    <Image
                      src={trip.image}
                      alt={trip.carName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Trip Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {trip.carName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{trip.location}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {trip.startDate} to {trip.endDate}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Owner: {trip.ownerName}
                    </p>
                  </div>

                  {/* Trip Status and Actions */}
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      ₦{trip.amount.toLocaleString()}
                    </p>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.replace('_', ' ')}
                    </Badge>
                    <div>
                      <Button size="sm" variant="outline" className="w-full">
                        {trip.status === 'pending_payment' ? 'Pay Now' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingTrips.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming trips</p>
                  <Button className="mt-4">
                    <Search className="mr-2 h-4 w-4" />
                    Find a Car
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Cars */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Favorite Cars</h3>
              <Button variant="ghost" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteCars.map((car) => (
                <div key={car.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  {/* Car Image */}
                  <div className="w-12 h-9 relative rounded-md overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {car.name}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500 truncate">{car.location}</p>
                    </div>
                    <p className="text-xs text-primary font-medium mt-1">
                      ₦{car.price.toLocaleString()}/day
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-1">
                    <Button size="sm" className="text-xs px-2 py-1 h-6">
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Trips</h3>
            <Button variant="ghost" size="sm">
              View All History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                {/* Car Image */}
                <div className="w-16 h-12 relative rounded-md overflow-hidden">
                  <Image
                    src={trip.image}
                    alt={trip.carName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Trip Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {trip.carName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{trip.location}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {trip.startDate} to {trip.endDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {renderStars(trip.rating)}
                  </div>
                </div>

                {/* Trip Amount */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₦{trip.amount.toLocaleString()}
                  </p>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}