'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          MemoryLane
        </Link>
        
        <div className="flex items-center gap-4">
          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/create/capsule" className="hover:text-indigo-600">
                Create
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm hidden md:inline">
                  Hi, {session.user?.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};