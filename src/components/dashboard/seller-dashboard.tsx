/**
 * Seller Dashboard Component
 *
 * This component displays the main dashboard for car owners/sellers.
 * It shows key metrics, recent bookings, car performance, and quick actions.
 *
 * Features:
 * - Earnings and booking statistics
 * - Car listing management
 * - Booking requests and calendar
 * - Performance analytics
 * - Quick action buttons for common tasks
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  Settings,
  MapPin,
  Star,
  Clock
} from 'lucide-react';
import type { User } from '@/lib/auth';
import { sampleCars } from '@/lib/seed-data';
import Image from 'next/image';

interface SellerDashboardProps {
  user: User;
}

/**
 * Seller Dashboard Component
 *
 * Main dashboard view for car owners showing their business metrics,
 * active listings, and recent booking activity.
 */
export function SellerDashboard({ user }: SellerDashboardProps) {
  // Sample data - will be replaced with real API calls
  const stats = [
    {
      title: 'Total Earnings',
      value: '₦234,500',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      description: 'This month',
    },
    {
      title: 'Active Bookings',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Calendar,
      description: 'Currently rented',
    },
    {
      title: 'Car Listings',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Car,
      description: 'Live listings',
    },
    {
      title: 'Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      description: 'Average rating',
    },
  ];

  // Sample recent bookings data
  const recentBookings = [
    {
      id: 1,
      carName: 'Toyota Camry 2022',
      renterName: 'Adebayo Okafor',
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      amount: 45000,
      status: 'active',
      avatar: 'AO',
    },
    {
      id: 2,
      carName: 'Honda Accord 2021',
      renterName: 'Funmi Adeleke',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      amount: 36000,
      status: 'confirmed',
      avatar: 'FA',
    },
    {
      id: 3,
      carName: 'Lexus RX 2023',
      renterName: 'Emeka Okafor',
      startDate: '2024-01-25',
      endDate: '2024-01-28',
      amount: 105000,
      status: 'pending',
      avatar: 'EO',
    },
  ];

  // Sample car listings for this seller
  const myCarListings = sampleCars.slice(0, 3);

  /**
   * Get status color based on booking status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            Here's what's happening with your car rental business
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Car
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
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
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <stat.icon className={`h-6 w-6 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
              <Button variant="ghost" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  {/* Renter Avatar */}
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {booking.avatar}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.renterName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {booking.carName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {booking.startDate} to {booking.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Booking Status and Amount */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ₦{booking.amount.toLocaleString()}
                    </p>
                    <Badge className={`mt-1 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Car Listings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Car Listings</h3>
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCarListings.map((car) => (
                <div key={car.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  {/* Car Image */}
                  <div className="w-16 h-12 relative rounded-md overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {car.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{car.location}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <p className="text-xs text-gray-500">{car.rating} rating</p>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ₦{car.price.toLocaleString()}/day
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}