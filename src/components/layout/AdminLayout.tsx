import React from 'react';
import { NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Home, Users, Wallet, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
const AdminSidebar = () => {
  const logout = useAuth(s => s.logout);
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/wallets', label: 'Wallets', icon: Wallet },
  ];
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-slate-50 dark:bg-slate-900/50 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold font-display text-foreground">Refundeee Admin</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-primary/10 text-primary font-semibold'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth(s => s.user);
  const location = useLocation();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};