import { useState, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { CryptoWallet, Payment } from '@shared/types';
import { AlertCircle, Copy, Check, Loader2 } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/sonner';
const MOCK_EXCHANGE_RATES: Record<string, number> = {
  BTC: 65000,
  ETH: 3500,
  USDT: 1,
};
const FACILITATOR_FEE_USD = 1000;
export function PaymentPage() {
  const user = useAuth(s => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { data: wallets, isLoading: isLoadingWallets, error: walletsError } = useQuery<CryptoWallet[]>({
    queryKey: ['wallets'],
    queryFn: () => api('/api/wallets'),
    enabled: !!user,
  });
  const createPaymentMutation = useMutation({
    mutationFn: (newPayment: Omit<Payment, 'id' | 'user_id' | 'created_at' | 'status'>) => {
      return api<Payment>('/api/payments', {
        method: 'POST',
        body: JSON.stringify(newPayment),
      });
    },
    onSuccess: () => {
      toast.success("Payment submitted for verification.", {
        description: "Your dashboard will be updated upon confirmation. Redirecting...",
      });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      setTimeout(() => navigate('/dashboard'), 3000);
    },
    onError: (error) => {
      toast.error("Payment Failed", { description: error.message });
    },
  });
  const selectedWallet = useMemo(() => {
    return wallets?.find(w => w.id === selectedWalletId);
  }, [wallets, selectedWalletId]);
  const cryptoAmount = useMemo(() => {
    if (!selectedWallet) return 0;
    const rate = MOCK_EXCHANGE_RATES[selectedWallet.cryptocurrency] || 0;
    return rate > 0 ? FACILITATOR_FEE_USD / rate : 0;
  }, [selectedWallet]);
  const handleCopy = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handlePaymentConfirmation = () => {
    if (!selectedWallet) {
      toast.error("Please select a cryptocurrency to pay with.");
      return;
    }
    createPaymentMutation.mutate({
      amount: FACILITATOR_FEE_USD,
      cryptocurrency: selectedWallet.cryptocurrency,
      wallet_address: selectedWallet.wallet_address,
      transaction_hash: `mock_tx_${Date.now()}`, // Mock transaction hash
    });
  };
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppLayout>
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 lg:py-20 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Facilitator's Fee Payment</CardTitle>
              <CardDescription>Complete the payment of ${FACILITATOR_FEE_USD} to activate your case.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {walletsError && (
                <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{walletsError.message}</AlertDescription></Alert>
              )}
              {isLoadingWallets ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pay with Cryptocurrency</label>
                  <Select onValueChange={setSelectedWalletId} disabled={createPaymentMutation.isPending}>
                    <SelectTrigger><SelectValue placeholder="Select a currency" /></SelectTrigger>
                    <SelectContent>
                      {wallets?.map(wallet => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.cryptocurrency} ({wallet.network})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedWallet && (
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Please send:</p>
                    <p className="text-2xl font-bold font-mono tracking-tight">{cryptoAmount.toFixed(8)} {selectedWallet.cryptocurrency}</p>
                    <p className="text-xs text-muted-foreground">(= ${FACILITATOR_FEE_USD})</p>
                  </div>
                  <div className="text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedWallet.wallet_address}`}
                      alt="QR Code"
                      className="mx-auto rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">To this address:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        readOnly
                        value={selectedWallet.wallet_address}
                        className="w-full text-sm bg-transparent font-mono truncate p-2 border rounded-md"
                      />
                      <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Only send {selectedWallet.cryptocurrency} ({selectedWallet.network}) to this address. Sending any other asset may result in the loss of your funds.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              <Button
                className="w-full"
                size="lg"
                onClick={handlePaymentConfirmation}
                disabled={!selectedWallet || createPaymentMutation.isPending}
              >
                {createPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                I Have Sent The Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}