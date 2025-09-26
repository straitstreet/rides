import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Users, DollarSign, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Listings',
      value: '1,234',
      change: '+8%',
      trend: 'up',
      icon: Car,
    },
    {
      title: 'Revenue (₦)',
      value: '₦45.2M',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Pending Approvals',
      value: '18',
      change: '-5%',
      trend: 'down',
      icon: AlertTriangle,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: Adebayo Okafor',
      timestamp: '2 minutes ago',
      status: 'info',
    },
    {
      id: 2,
      type: 'car_verification',
      message: 'Car verification pending: Toyota Camry 2022',
      timestamp: '15 minutes ago',
      status: 'warning',
    },
    {
      id: 3,
      type: 'booking_completed',
      message: 'Booking completed: ₦45,000 payment received',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'report_submitted',
      message: 'User reported inappropriate listing',
      timestamp: '2 hours ago',
      status: 'error',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-primary' : 'text-red-600'}`}>
                    {stat.change} from last month
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-primary' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Verify User Documents
                <Badge variant="secondary" className="ml-auto">5 pending</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Car className="mr-2 h-4 w-4" />
                Review Car Listings
                <Badge variant="secondary" className="ml-auto">12 pending</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Handle Reports
                <Badge variant="destructive" className="ml-auto">3 urgent</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payouts
                <Badge variant="secondary" className="ml-auto">8 pending</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}