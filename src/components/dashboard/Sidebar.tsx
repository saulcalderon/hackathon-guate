'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Users, TrendingUp, Settings, LogOut, Search, ShoppingCart, Zap } from "lucide-react";
import { useAuth } from '@/components/auth/AuthProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Solicitudes", href: "/dashboard/solicitudes", icon: <Search className="w-5 h-5" /> },
    { name: "Mis Compras", href: "/dashboard/compras", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Planes", href: "/dashboard/planes", icon: <Zap className="w-5 h-5" /> },
    { name: "Invoices", href: "/dashboard/invoices", icon: <FileText className="w-5 h-5" /> },
    { name: "Suppliers", href: "/dashboard/suppliers", icon: <Users className="w-5 h-5" /> },
    { name: "Analytics", href: "/dashboard/analytics", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    setIsSigningOut(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage('');
    router.push('/?login=1');
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen fixed left-0 top-0">
      {/* Sidebar Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-findrai-primary to-findrai-medium flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg leading-none">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Findr.ai</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
          Main Menu
        </div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? "bg-findrai-primary/20 text-findrai-light"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-1">
        {errorMessage ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {errorMessage}
          </div>
        ) : null}
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left w-full mt-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  );
}
