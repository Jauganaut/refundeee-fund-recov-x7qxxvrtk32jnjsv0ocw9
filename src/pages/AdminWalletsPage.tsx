import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { CryptoWallet } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
export function AdminWalletsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({ cryptocurrency: '', network: '', wallet_address: '' });
  const { data: wallets, isLoading } = useQuery<CryptoWallet[]>({
    queryKey: ['adminWallets'],
    queryFn: () => api('/api/admin/wallets'),
  });
  const addWalletMutation = useMutation({
    mutationFn: (wallet: Omit<CryptoWallet, 'id' | 'is_active' | 'created_at'>) => api<CryptoWallet>('/api/admin/wallets', { method: 'POST', body: JSON.stringify(wallet) }),
    onSuccess: () => {
      toast.success('Wallet added successfully');
      queryClient.invalidateQueries({ queryKey: ['adminWallets'] });
      setIsDialogOpen(false);
      setNewWallet({ cryptocurrency: '', network: '', wallet_address: '' });
    },
    onError: (error) => toast.error('Failed to add wallet', { description: error.message }),
  });
  const updateWalletMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<CryptoWallet> & { id: string }) => api<CryptoWallet>(`/api/admin/wallets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast.success('Wallet updated');
      queryClient.invalidateQueries({ queryKey: ['adminWallets'] });
    },
    onError: (error) => toast.error('Update failed', { description: error.message }),
  });
  const deleteWalletMutation = useMutation({
    mutationFn: (id: string) => api(`/api/admin/wallets/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Wallet deleted');
      queryClient.invalidateQueries({ queryKey: ['adminWallets'] });
    },
    onError: (error) => toast.error('Delete failed', { description: error.message }),
  });
  const handleAddWallet = () => {
    if (newWallet.cryptocurrency && newWallet.network && newWallet.wallet_address) {
      addWalletMutation.mutate(newWallet);
    } else {
      toast.error('All fields are required');
    }
  };
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Wallet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Wallet</DialogTitle>
                <DialogDescription>Enter the details for the new cryptocurrency wallet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="crypto" className="text-right">Currency</Label>
                  <Input id="crypto" value={newWallet.cryptocurrency} onChange={e => setNewWallet(p => ({ ...p, cryptocurrency: e.target.value.toUpperCase() }))} className="col-span-3" placeholder="e.g., BTC" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="network" className="text-right">Network</Label>
                  <Input id="network" value={newWallet.network} onChange={e => setNewWallet(p => ({ ...p, network: e.target.value }))} className="col-span-3" placeholder="e.g., Bitcoin" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input id="address" value={newWallet.wallet_address} onChange={e => setNewWallet(p => ({ ...p, wallet_address: e.target.value }))} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddWallet} disabled={addWalletMutation.isPending}>Add Wallet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Available Wallets</CardTitle>
            <CardDescription>Manage the wallets available for fee payments.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets?.map(wallet => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.cryptocurrency}</TableCell>
                      <TableCell>{wallet.network}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-xs">{wallet.wallet_address}</TableCell>
                      <TableCell>
                        <Switch
                          checked={wallet.is_active}
                          onCheckedChange={(checked) => updateWalletMutation.mutate({ id: wallet.id, is_active: checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteWalletMutation.mutate(wallet.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}