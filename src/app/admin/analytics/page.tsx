import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Calendar,
  BarChart3,
  Download,
  Eye
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Mock analytics data - in production, fetch from API
  const kpiMetrics = [
    {
      title: 'Total Revenue',
      value: '₦24.2M',
      change: '+23.5%',
      trend: 'up',
      period: 'vs last month',
      icon: DollarSign
    },
    {
      title: 'Active Users',
      value: '12,847',
      change: '+18.2%',
      trend: 'up',
      period: 'vs last month',
      icon: Users
    },
    {
      title: 'Total Bookings',
      value: '3,456',
      change: '+15.8%',
      trend: 'up',
      period: 'vs last month',
      icon: Calendar
    },
    {
      title: 'Active Cars',
      value: '1,234',
      change: '+8.3%',
      trend: 'up',
      period: 'vs last month',
      icon: Car
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2400000, bookings: 180 },
    { month: 'Feb', revenue: 2800000, bookings: 220 },
    { month: 'Mar', revenue: 3200000, bookings: 280 },
    { month: 'Apr', revenue: 2900000, bookings: 240 },
    { month: 'May', revenue: 3600000, bookings: 320 },
    { month: 'Jun', revenue: 4100000, bookings: 380 }
  ];

  const topCities = [
    { city: 'Lagos', bookings: 1245, revenue: 8200000, growth: '+25%' },
    { city: 'Abuja', bookings: 876, revenue: 5800000, growth: '+18%' },
    { city: 'Port Harcourt', bookings: 432, revenue: 2900000, growth: '+22%' },
    { city: 'Kano', bookings: 321, revenue: 1800000, growth: '+15%' },
    { city: 'Ibadan', bookings: 298, revenue: 1600000, growth: '+12%' }
  ];

  const topCars = [
    { make: 'Toyota', model: 'Camry', bookings: 234, revenue: 1800000, avgRate: 15000 },
    { make: 'Honda', model: 'Accord', bookings: 198, revenue: 1650000, avgRate: 18000 },
    { make: 'Mercedes', model: 'GLE', bookings: 87, revenue: 1200000, avgRate: 45000 },
    { make: 'BMW', model: 'X5', bookings: 76, revenue: 980000, avgRate: 42000 },
    { make: 'Lexus', model: 'RX', bookings: 65, revenue: 850000, avgRate: 35000 }
  ];

  const userGrowth = [
    { month: 'Jan', sellers: 120, buyers: 890 },
    { month: 'Feb', sellers: 145, buyers: 1120 },
    { month: 'Mar', sellers: 167, buyers: 1350 },
    { month: 'Apr', sellers: 189, buyers: 1480 },
    { month: 'May', sellers: 212, buyers: 1720 },
    { month: 'Jun', sellers: 234, buyers: 1950 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track platform performance and key metrics</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Advanced Analytics
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-primary mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-primary' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded-full relative overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(data.revenue / 4100000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₦{(data.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">{data.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <p className="text-sm text-gray-500">{city.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{(city.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-primary">{city.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cars */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCars.map((car) => (
                <div key={`${car.make}-${car.model}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Car className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{car.make} {car.model}</p>
                      <p className="text-sm text-gray-500">{car.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{(car.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-500">₦{car.avgRate.toLocaleString()}/day</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userGrowth.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-gray-500">Total: {data.sellers + data.buyers}</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 space-y-1">
                      <div className="h-6 bg-blue-100 rounded-full relative overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(data.buyers / 2000) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{data.buyers} Buyers</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-6 bg-primary/10 rounded-full relative overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(data.sellers / 250) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{data.sellers} Sellers</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Eye className="h-5 w-5" />
              <span className="text-sm">View Detailed Reports</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export CSV Data</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">Custom Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}