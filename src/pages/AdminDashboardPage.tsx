import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { AdminDashboardData, Case, Profile, Balance } from '@shared/types';
import { AlertCircle, Users, FileText, DollarSign, BarChart2 } from 'lucide-react';
import { AdminCaseDataTable } from '@/components/AdminCaseDataTable';
import { AdminUsersDataTable } from '@/components/AdminUsersDataTable';
import { UpdateBalanceDialog } from '@/components/UpdateBalanceDialog';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { toast } from '@/components/ui/sonner';
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const { data, isLoading, error } = useQuery<AdminDashboardData>({
    queryKey: ['adminDashboardData'],
    queryFn: () => api('/api/admin/dashboard-data'),
  });
  const updateStatusMutation = useMutation({
    mutationFn: ({ caseId, status }: { caseId: string, status: string }) =>
      api<Case>(`/api/admin/cases/${caseId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Case status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
    onError: (error) => {
      toast.error("Failed to update status", { description: error.message });
    },
  });
  const updateBalanceMutation = useMutation({
    mutationFn: ({ userId, amount }: { userId: string, amount: number }) =>
      api<Balance>(`/api/admin/balances/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
      }),
    onSuccess: () => {
      toast.success("User balance updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
      setIsBalanceDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error("Failed to update balance", { description: error.message });
    },
  });
  const handleStatusChange = (caseId: string, status: string) => {
    updateStatusMutation.mutate({ caseId, status });
  };
  const handleManageBalance = (user: Profile) => {
    setSelectedUser(user);
    setIsBalanceDialogOpen(true);
  };
  const handleUpdateBalance = (userId: string, newAmount: number) => {
    updateBalanceMutation.mutate({ userId, amount: newAmount });
  };
  const totalAmountLost = data?.cases.reduce((sum, c) => sum + c.amount_lost, 0) || 0;
  const totalAmountRecovered = data?.balances.reduce((sum, b) => sum + b.recovered_amount, 0) || 0;
  const selectedUserBalance = data?.balances.find(b => b.user_id === selectedUser?.id) || null;
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <StatCard title="Total Cases" value={data.cases.length} icon={FileText} />
            <StatCard title="Total Users" value={data.users.length} icon={Users} />
            <StatCard title="Total Amount Lost" value={`$${totalAmountLost.toLocaleString()}`} icon={DollarSign} />
            <StatCard title="Total Recovered" value={`$${totalAmountRecovered.toLocaleString()}`} icon={DollarSign} />
          </div>
        ) : null}
        <Tabs defaultValue="cases" className="mt-8">
          <TabsList>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="cases" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Management</CardTitle>
                <CardDescription>View and manage all submitted cases.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-96" /> : data ? <AdminCaseDataTable cases={data.cases} users={data.users} onStatusChange={handleStatusChange} /> : null}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View all registered users and manage their balances.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-96" /> : data ? <AdminUsersDataTable users={data.users} balances={data.balances} onManageBalance={handleManageBalance} /> : null}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
             <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>An overview of platform activity and trends.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-[350px]" /> : data ? <AdminAnalytics data={data} /> : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <UpdateBalanceDialog
        isOpen={isBalanceDialogOpen}
        onOpenChange={setIsBalanceDialogOpen}
        user={selectedUser}
        balance={selectedUserBalance}
        onUpdate={handleUpdateBalance}
        isUpdating={updateBalanceMutation.isPending}
      />
    </AdminLayout>
  );
}