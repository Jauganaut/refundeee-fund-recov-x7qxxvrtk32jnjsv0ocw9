import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Profile, Balance } from "@shared/types";
interface UpdateBalanceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: Profile | null;
  balance: Balance | null;
  onUpdate: (userId: string, newAmount: number) => void;
  isUpdating: boolean;
}
export function UpdateBalanceDialog({
  isOpen,
  onOpenChange,
  user,
  balance,
  onUpdate,
  isUpdating,
}: UpdateBalanceDialogProps) {
  const [amount, setAmount] = useState<number | string>("");
  useEffect(() => {
    if (balance) {
      setAmount(balance.recovered_amount);
    } else {
      setAmount(0);
    }
  }, [balance]);
  const handleUpdate = () => {
    if (user && typeof Number(amount) === 'number') {
      onUpdate(user.id, Number(amount));
    }
  };
  if (!user) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Balance for {user.first_name} {user.last_name}</DialogTitle>
          <DialogDescription>
            Update the recovered funds balance. Enter the new total amount.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={user.email} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-balance" className="text-right">
              Current
            </Label>
            <Input
              id="current-balance"
              value={`$${balance?.recovered_amount.toFixed(2) ?? '0.00'}`}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-balance" className="text-right">
              New Total
            </Label>
            <Input
              id="new-balance"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="Enter new total recovered amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Balance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}