'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-deep border-b border-white/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">Ubucuruzi ERP</span>
          <span className="text-xl font-bold gradient-text sm:hidden">U ERP</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="glass-modern border-none hover:bg-white/10 dark:hover:bg-white/5">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="gradient-primary text-white shadow-lg shadow-blue-500/25">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="glass-modern border-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-deep border-t border-white/5 p-4 space-y-2">
          <Link href="/login" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start glass-modern border-none">
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full gradient-primary text-white shadow-lg shadow-blue-500/25">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}