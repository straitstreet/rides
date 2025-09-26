import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Car, CheckCircle, XCircle, Clock, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function AdminCarsPage() {
  // Mock car data - in production, fetch from API
  const cars = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      plateNumber: 'LAG-123-AB',
      vin: 'JTDBU4EE9CJ123456',
      dailyRate: 15000,
      location: 'Lekki, Lagos',
      owner: 'Adebayo Ogundimu',
      ownerId: '1',
      isVerified: true,
      isAvailable: true,
      status: 'active',
      submittedAt: '2024-01-15',
      verifiedAt: '2024-01-16',
      totalBookings: 8,
      revenue: 120000,
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Accord',
      year: 2021,
      color: 'Blue',
      plateNumber: 'ABJ-456-CD',
      vin: 'JHMCR6F75EC123456',
      dailyRate: 18000,
      location: 'Wuse, Abuja',
      owner: 'Fatima Mohammed',
      ownerId: '2',
      isVerified: false,
      isAvailable: true,
      status: 'pending',
      submittedAt: '2024-01-25',
      verifiedAt: null,
      totalBookings: 0,
      revenue: 0,
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      id: '3',
      make: 'Mercedes-Benz',
      model: 'GLE',
      year: 2022,
      color: 'Black',
      plateNumber: 'PH-789-EF',
      vin: 'WDC0F7DC6KF123456',
      dailyRate: 45000,
      location: 'GRA, Port Harcourt',
      owner: 'Chioma Okwu',
      ownerId: '3',
      isVerified: true,
      isAvailable: false,
      status: 'maintenance',
      submittedAt: '2024-01-20',
      verifiedAt: '2024-01-22',
      totalBookings: 3,
      revenue: 135000,
      image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      id: '4',
      make: 'BMW',
      model: 'M4',
      year: 2023,
      color: 'White',
      plateNumber: 'KAN-999-XY',
      vin: 'WBS3K8C57EP123456',
      dailyRate: 55000,
      location: 'Ikoyi, Lagos',
      owner: 'Emeka Nwankwo',
      ownerId: '4',
      isVerified: false,
      isAvailable: true,
      status: 'rejected',
      submittedAt: '2024-01-28',
      verifiedAt: null,
      totalBookings: 0,
      revenue: 0,
      image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      rejectionReason: 'Incomplete insurance documents'
    }
  ];

  const stats = [
    { label: 'Total Cars', value: '1,234', change: '+8%', trend: 'up' },
    { label: 'Verified Cars', value: '1,087', change: '+6%', trend: 'up' },
    { label: 'Active Listings', value: '956', change: '+12%', trend: 'up' },
    { label: 'Pending Review', value: '18', change: '-5%', trend: 'down' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'maintenance': return <Car className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
          <p className="text-gray-600">Review and manage car listings on the platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Bulk Approve
          </Button>
          <Button>
            <Car className="mr-2 h-4 w-4" />
            Add Car
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
                placeholder="Search by make, model, plate number, or owner..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Cars</Button>
              <Button variant="outline">Pending</Button>
              <Button variant="outline">Active</Button>
              <Button variant="outline">Rejected</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`${getStatusColor(car.status)} capitalize`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(car.status)}
                    {car.status}
                  </span>
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{car.make} {car.model} {car.year}</h3>
                    <p className="text-sm text-gray-600">{car.location}</p>
                    <p className="text-sm text-gray-500">Owner: {car.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₦{car.dailyRate.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">/day</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Plate Number</p>
                    <p className="font-medium">{car.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium">{car.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Bookings</p>
                    <p className="font-medium">{car.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium">₦{car.revenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500">Submitted: {car.submittedAt}</p>
                  {car.verifiedAt && (
                    <p className="text-gray-500">Verified: {car.verifiedAt}</p>
                  )}
                  {car.rejectionReason && (
                    <p className="text-red-600">Rejected: {car.rejectionReason}</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {car.status === 'pending' && (
                      <>
                        <Button size="sm">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                    {car.status === 'active' && (
                      <Button size="sm" variant="outline">
                        <Car className="mr-1 h-3 w-3" />
                        Set Maintenance
                      </Button>
                    )}
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
                        <Car className="mr-2 h-4 w-4" />
                        View Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Bookings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}