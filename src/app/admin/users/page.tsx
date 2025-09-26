import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserCheck, UserX, Shield, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminUsersPage() {
  // Mock user data - in production, fetch from API
  const users = [
    {
      id: '1',
      firstName: 'Adebayo',
      lastName: 'Ogundimu',
      email: 'adebayo.ogundimu@example.com',
      phone: '+234 803 123 4567',
      role: 'seller',
      isVerified: true,
      isActive: true,
      joinedAt: '2024-01-15',
      totalBookings: 12,
      revenue: 450000,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Mohammed',
      email: 'fatima.mohammed@example.com',
      phone: '+234 805 987 6543',
      role: 'buyer',
      isVerified: true,
      isActive: true,
      joinedAt: '2024-01-20',
      totalBookings: 8,
      revenue: 0,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '3',
      firstName: 'Chioma',
      lastName: 'Okwu',
      email: 'chioma.okwu@example.com',
      phone: '+234 806 111 2222',
      role: 'seller',
      isVerified: false,
      isActive: true,
      joinedAt: '2024-01-25',
      totalBookings: 0,
      revenue: 0,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '4',
      firstName: 'Emeka',
      lastName: 'Nwankwo',
      email: 'emeka.nwankwo@example.com',
      phone: '+234 807 333 4444',
      role: 'buyer',
      isVerified: true,
      isActive: false,
      joinedAt: '2024-01-18',
      totalBookings: 15,
      revenue: 0,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', trend: 'up' },
    { label: 'Verified Users', value: '2,654', change: '+8%', trend: 'up' },
    { label: 'Active Sellers', value: '543', change: '+15%', trend: 'up' },
    { label: 'Pending Verifications', value: '23', change: '-5%', trend: 'down' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their verification status</p>
        </div>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" />
          Bulk Verify
        </Button>
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
                placeholder="Search by name, email, or phone..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Users</Button>
              <Button variant="outline">Sellers</Button>
              <Button variant="outline">Buyers</Button>
              <Button variant="outline">Unverified</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                      <Badge variant={user.role === 'seller' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="outline" className="text-primary border-primary">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {!user.isActive && (
                        <Badge variant="destructive">
                          <UserX className="w-3 h-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.totalBookings} bookings</p>
                    {user.role === 'seller' && (
                      <p className="text-sm text-gray-500">₦{user.revenue.toLocaleString()} revenue</p>
                    )}
                    <p className="text-xs text-gray-400">Joined {user.joinedAt}</p>
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserCheck className="mr-2 h-4 w-4" />
                        {user.isVerified ? 'Unverify' : 'Verify'} User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        {user.isActive ? 'Suspend' : 'Activate'} Account
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