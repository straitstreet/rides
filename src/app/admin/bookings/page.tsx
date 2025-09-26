import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar, MapPin, DollarSign, Eye, MoreHorizontal, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminBookingsPage() {
  // Mock booking data - in production, fetch from API
  const bookings = [
    {
      id: '1',
      bookingReference: 'BK-2024-001',
      car: {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        plateNumber: 'LAG-123-AB'
      },
      renter: {
        id: '1',
        name: 'Adebayo Ogundimu',
        email: 'adebayo@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      owner: {
        id: '2',
        name: 'Fatima Mohammed',
        email: 'fatima@example.com'
      },
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      duration: 4,
      dailyRate: 15000,
      totalAmount: 60000,
      status: 'confirmed',
      pickupLocation: 'Lekki Phase 1, Lagos',
      dropoffLocation: 'Lekki Phase 1, Lagos',
      createdAt: '2024-01-28',
      paymentStatus: 'paid'
    },
    {
      id: '2',
      bookingReference: 'BK-2024-002',
      car: {
        make: 'Honda',
        model: 'Accord',
        year: 2021,
        plateNumber: 'ABJ-456-CD'
      },
      renter: {
        id: '3',
        name: 'Chioma Okwu',
        email: 'chioma@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      owner: {
        id: '4',
        name: 'Emeka Nwankwo',
        email: 'emeka@example.com'
      },
      startDate: '2024-02-03',
      endDate: '2024-02-07',
      duration: 4,
      dailyRate: 18000,
      totalAmount: 72000,
      status: 'active',
      pickupLocation: 'Wuse II, Abuja',
      dropoffLocation: 'Garki, Abuja',
      createdAt: '2024-01-30',
      paymentStatus: 'paid'
    },
    {
      id: '3',
      bookingReference: 'BK-2024-003',
      car: {
        make: 'Mercedes-Benz',
        model: 'GLE',
        year: 2022,
        plateNumber: 'PH-789-EF'
      },
      renter: {
        id: '5',
        name: 'Aisha Bello',
        email: 'aisha@example.com',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face'
      },
      owner: {
        id: '6',
        name: 'Olumide Adeyemi',
        email: 'olumide@example.com'
      },
      startDate: '2024-01-25',
      endDate: '2024-01-28',
      duration: 3,
      dailyRate: 45000,
      totalAmount: 135000,
      status: 'completed',
      pickupLocation: 'GRA, Port Harcourt',
      dropoffLocation: 'GRA, Port Harcourt',
      createdAt: '2024-01-22',
      paymentStatus: 'paid'
    },
    {
      id: '4',
      bookingReference: 'BK-2024-004',
      car: {
        make: 'BMW',
        model: 'M4',
        year: 2023,
        plateNumber: 'KAN-999-XY'
      },
      renter: {
        id: '7',
        name: 'Kemi Okafor',
        email: 'kemi@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face'
      },
      owner: {
        id: '8',
        name: 'Tunde Adebayo',
        email: 'tunde@example.com'
      },
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      duration: 2,
      dailyRate: 55000,
      totalAmount: 110000,
      status: 'pending',
      pickupLocation: 'Ikoyi, Lagos',
      dropoffLocation: 'Victoria Island, Lagos',
      createdAt: '2024-02-01',
      paymentStatus: 'pending'
    },
    {
      id: '5',
      bookingReference: 'BK-2024-005',
      car: {
        make: 'Lexus',
        model: 'RX',
        year: 2023,
        plateNumber: 'LAG-555-ZZ'
      },
      renter: {
        id: '9',
        name: 'Seun Adesola',
        email: 'seun@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      },
      owner: {
        id: '10',
        name: 'Bola Fashola',
        email: 'bola@example.com'
      },
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      duration: 2,
      dailyRate: 35000,
      totalAmount: 70000,
      status: 'cancelled',
      pickupLocation: 'Lekki, Lagos',
      dropoffLocation: 'Lekki, Lagos',
      createdAt: '2024-01-18',
      paymentStatus: 'refunded'
    }
  ];

  const stats = [
    { label: 'Total Bookings', value: '3,456', change: '+18%', trend: 'up' },
    { label: 'Active Rentals', value: '234', change: '+5%', trend: 'up' },
    { label: 'Revenue (₦)', value: '₦12.4M', change: '+23%', trend: 'up' },
    { label: 'Avg. Daily Rate', value: '₦28,500', change: '+12%', trend: 'up' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-primary/10 text-primary';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Monitor and manage all platform bookings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Revenue Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm ${stat.trend === 'up' ? 'text-primary' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by booking reference, renter, or car..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Bookings</Button>
              <Button variant="outline">Active</Button>
              <Button variant="outline">Pending</Button>
              <Button variant="outline">Completed</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={booking.renter.avatar} alt={booking.renter.name} />
                      <AvatarFallback>{booking.renter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{booking.bookingReference}</h3>
                      <p className="text-sm text-gray-600">{booking.renter.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                      {booking.status}
                    </Badge>
                    <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} capitalize`}>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">{booking.car.make} {booking.car.model} {booking.car.year}</p>
                    <p className="text-sm text-gray-400">{booking.car.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.duration} days</p>
                    <p className="text-sm text-gray-400">{booking.startDate} to {booking.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">₦{booking.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">₦{booking.dailyRate.toLocaleString()}/day</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium">{booking.owner.name}</p>
                    <p className="text-sm text-gray-400">{booking.owner.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Pickup: {booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Created: {booking.createdAt}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        View Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        Track Location
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}