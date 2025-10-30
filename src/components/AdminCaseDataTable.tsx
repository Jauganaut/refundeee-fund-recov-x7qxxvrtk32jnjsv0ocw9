import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { format } from 'date-fns';
import type { Case, Profile } from '@shared/types';
interface AdminCaseDataTableProps {
  cases: Case[];
  users: Profile[];
  onStatusChange: (caseId: string, status: string) => void;
}
export function AdminCaseDataTable({ cases, users, onStatusChange }: AdminCaseDataTableProps) {
  const [filter, setFilter] = useState('');
  const usersById = new Map(users.map(u => [u.id, u]));
  const filteredCases = cases.filter(c => {
    const user = usersById.get(c.user_id);
    const searchString = `${user?.first_name} ${user?.last_name} ${user?.email} ${c.status} ${c.scam_type}`.toLowerCase();
    return searchString.includes(filter.toLowerCase());
  });
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary';
      case 'in_review': return 'secondary';
      case 'active': return 'default';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name, email, status..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Scam Type</TableHead>
              <TableHead>Amount Lost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length ? (
              filteredCases.map((c) => {
                const user = usersById.get(c.user_id);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </TableCell>
                    <TableCell>{c.scam_type}</TableCell>
                    <TableCell>${c.amount_lost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(c.status)} className="capitalize">{c.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(c.created_at), 'PPP')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onStatusChange(c.id, 'in_review')}>Set to "In Review"</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(c.id, 'active')}>Set to "Active"</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(c.id, 'closed')}>Set to "Closed"</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}