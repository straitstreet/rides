import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, MoreHorizontal, Shield, Flag, MessageSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminReportsPage() {
  const reports = [
    {
      id: '1',
      type: 'inappropriate_listing',
      title: 'Inappropriate Car Listing',
      description: 'User reported fake car photos and misleading information',
      reportedBy: 'Adebayo Ogundimu',
      reportedUser: 'Fake Car Owner',
      reportedItem: 'Mercedes-Benz GLE 2023',
      priority: 'high',
      status: 'pending',
      createdAt: '2024-01-28',
      evidence: ['Photo mismatch', 'Fake license plate']
    },
    {
      id: '2',
      type: 'user_behavior',
      title: 'Rude Behavior',
      description: 'Car owner was unprofessional and rude during pickup',
      reportedBy: 'Fatima Mohammed',
      reportedUser: 'John Doe',
      reportedItem: 'Toyota Camry Rental',
      priority: 'medium',
      status: 'investigating',
      createdAt: '2024-01-26',
      evidence: ['Chat logs', 'Witness statement']
    },
    {
      id: '3',
      type: 'payment_dispute',
      title: 'Payment Dispute',
      description: 'Customer claims car was damaged before rental',
      reportedBy: 'Chioma Okwu',
      reportedUser: 'Car Owner ABC',
      reportedItem: 'Honda Accord Booking',
      priority: 'urgent',
      status: 'resolved',
      createdAt: '2024-01-25',
      evidence: ['Damage photos', 'Insurance report']
    }
  ];

  const stats = [
    { label: 'Total Reports', value: '147', change: '+8%', trend: 'up' },
    { label: 'Pending Review', value: '23', change: '-12%', trend: 'down' },
    { label: 'Resolved Today', value: '8', change: '+25%', trend: 'up' },
    { label: 'High Priority', value: '5', change: '+67%', trend: 'up' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-primary/10 text-primary';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inappropriate_listing': return <Flag className="w-4 h-4" />;
      case 'user_behavior': return <MessageSquare className="w-4 h-4" />;
      case 'payment_dispute': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Issues</h1>
          <p className="text-gray-600">Monitor and resolve platform reports and disputes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Trends
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Safety Center
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
                  {stat.change} from last week
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      {getTypeIcon(report.type)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{report.title}</h3>
                      <p className="text-gray-600">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Reported by: <strong>{report.reportedBy}</strong></span>
                        <span>•</span>
                        <span>Against: <strong>{report.reportedUser}</strong></span>
                        <span>•</span>
                        <span>{report.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(report.priority)} capitalize`}>
                      {report.priority}
                    </Badge>
                    <Badge className={`${getStatusColor(report.status)} capitalize`}>
                      {report.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reported Item</p>
                    <p className="font-medium">{report.reportedItem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Evidence Provided</p>
                    <div className="flex flex-wrap gap-1">
                      {report.evidence.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {report.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Start Investigation
                        </Button>
                        <Button size="sm" variant="outline">
                          Request More Info
                        </Button>
                      </>
                    )}
                    {report.status === 'investigating' && (
                      <>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Resolve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Escalate
                        </Button>
                      </>
                    )}
                    {report.status === 'resolved' && (
                      <Badge className="bg-primary/10 text-primary">
                        Resolved on {report.createdAt}
                      </Badge>
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
                        View Full Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Reporter
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        View User Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm">Emergency Response</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Safety Guidelines</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Flag className="h-5 w-5 text-orange-600" />
              <span className="text-sm">Report Templates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}