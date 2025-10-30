import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { DashboardData } from '@shared/types';
import { AlertCircle, CheckCircle, FileText, Landmark, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
function DashboardLoadingSkeleton() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
export function DashboardPage() {
  const user = useAuth(s => s.user);
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData', user?.id],
    queryFn: () => api('/api/dashboard-data'),
    enabled: !!user,
  });
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const hasPaid = data?.payments?.some(p => p.status === 'confirmed');
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {user.first_name}!</h1>
            <p className="text-muted-foreground">Here's an overview of your account and case status.</p>
          </header>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          {isLoading ? (
            <DashboardLoadingSkeleton />
          ) : data ? (
            <div className="grid gap-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Case Status</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{data.case.status}</div>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {format(new Date(data.case.created_at), 'PPP')}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recovered Funds</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${data.balance.recovered_amount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Updates will appear here</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Facilitator's Fee</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {hasPaid ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span className="text-lg font-semibold text-green-600">Paid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <span className="text-lg font-semibold text-destructive">Required</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {hasPaid ? 'Thank you for your payment.' : 'Payment of $1000 is required.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              {!hasPaid && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span>Your case is pending. Please pay the facilitator's fee to activate the recovery process.</span>
                    <Button asChild>
                      <Link to="/payment">Pay Facilitator's Fee</Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Case Details</CardTitle>
                  <CardDescription>A summary of the information you submitted.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="font-medium text-foreground">Amount Lost: <span className="font-normal text-muted-foreground">${data.case.amount_lost.toFixed(2)}</span></div>
                  <div className="font-medium text-foreground">Scam Type: <span className="font-normal text-muted-foreground">{data.case.scam_type}</span></div>
                  <div className="font-medium text-foreground">Bank Name: <span className="font-normal text-muted-foreground">{data.case.bank_name}</span></div>
                  <div className="font-medium text-foreground">First Payment: <span className="font-normal text-muted-foreground">{format(new Date(data.case.first_payment_date), 'PPP')}</span></div>
                  <div className="font-medium text-foreground col-span-full">Description: <p className="font-normal text-muted-foreground mt-1">{data.case.scam_description}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>A record of all payments related to your case.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.payments.length > 0 ? (
                        data.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.created_at), 'PPP')}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.cryptocurrency || 'USD'}</TableCell>
                            <TableCell>
                              <Badge variant={payment.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            No transactions yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}