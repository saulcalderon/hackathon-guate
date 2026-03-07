 'use client';

import { Bell, Search } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? 'Usuario autenticado';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-findrai-primary focus:ring-1 focus:ring-findrai-primary bg-slate-50 transition-colors"
            placeholder="Search invoices, suppliers, or items..."
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile (Clerk UserButton) */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 leading-tight">
              {email}
            </span>
            <span className="text-xs text-slate-500 font-medium">Cuenta activa</span>
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
