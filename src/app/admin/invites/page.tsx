'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Calendar, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface InviteCode {
  id: string;
  code: string;
  email?: string;
  role: 'buyer' | 'seller' | 'admin';
  isActive: boolean;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface InviteAnalytics {
  active: number;
  used: number;
  total: number;
}

const InviteManagement = () => {
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [analytics, setAnalytics] = useState<InviteAnalytics>({ active: 0, used: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page] = useState(1);

  // Form state
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'buyer' as 'buyer' | 'seller' | 'admin',
    expiresIn: 30,
  });

  const fetchInvites = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }

      const response = await fetch(`/api/invites?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invites');
      }

      const data = await response.json();
      setInvites(data.invites);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, roleFilter]);

  const createInvite = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newInvite),
      });

      if (!response.ok) {
        throw new Error('Failed to create invite');
      }

      const data = await response.json();
      setInvites([data.invite, ...invites]);
      setAnalytics(prev => ({ ...prev, active: prev.active + 1, total: prev.total + 1 }));

      // Reset form
      setNewInvite({ email: '', role: 'buyer', expiresIn: 30 });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating invite:', error);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getStatusBadge = (invite: InviteCode) => {
    if (invite.usedAt) {
      return <Badge variant="secondary" className="bg-primary/10 text-primary"><CheckCircle className="w-3 h-3 mr-1" />Used</Badge>;
    }
    if (new Date(invite.expiresAt) < new Date()) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
    }
    return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-orange-100 text-orange-800',
      buyer: 'bg-blue-100 text-blue-800',
    };

    return <Badge variant="outline" className={colors[role as keyof typeof colors]}>{role}</Badge>;
  };

  useEffect(() => {
    fetchInvites();
  }, [page, statusFilter, roleFilter, fetchInvites]);

  if (loading && invites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invite Management</h1>
          <p className="text-gray-600">Manage platform access with invite codes</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invite Code</DialogTitle>
              <DialogDescription>
                Generate a new invite code for platform access
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newInvite.role} onValueChange={(value: 'buyer' | 'seller' | 'admin') => setNewInvite(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiresIn">Expires In (Days)</Label>
                <Input
                  id="expiresIn"
                  type="number"
                  min="1"
                  max="365"
                  value={newInvite.expiresIn}
                  onChange={(e) => setNewInvite(prev => ({ ...prev, expiresIn: parseInt(e.target.value) }))}
                />
              </div>

              <Button onClick={createInvite} disabled={creating} className="w-full">
                {creating ? 'Creating...' : 'Create Invite Code'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Invites</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.active}</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Invites</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.used}</div>
            <p className="text-xs text-muted-foreground">Successfully redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">All time generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="seller">Seller</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invite Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Codes</CardTitle>
          <CardDescription>All generated invite codes and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">{invite.code}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(invite.code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {getStatusBadge(invite)}
                    {getRoleBadge(invite.role)}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Created by {invite.createdBy.firstName} {invite.createdBy.lastName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Expires {format(new Date(invite.expiresAt), 'PPP')}
                    </span>
                    {invite.email && (
                      <span>For: {invite.email}</span>
                    )}
                    {invite.usedAt && (
                      <span>Used: {format(new Date(invite.usedAt), 'PPP')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {invites.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No invite codes found. Create your first invite code to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteManagement;