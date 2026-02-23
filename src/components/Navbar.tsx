"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Compass, LogIn, LogOut, Search, Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import { useTranslation } from '@/hooks/useTranslation';

function NavbarContent() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'discovery';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-surface-variant/80 backdrop-blur-xl shadow-elevation-2 py-2" : "bg-transparent py-4"
        )}>
            <div className="w-full h-16 flex items-center justify-between px-8">
                {/* LEFT: Logo & Brand */}
                <div className="flex items-center justify-start">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary transition-transform">
                            <Compass size={20} className="text-on-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-on-surface">
                            Algoree
                        </span>
                    </Link>
                </div>

                {/* RIGHT: Auth & Profile */}
                <div className="flex items-center justify-end gap-4">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container hidden sm:block">
                        <Search size={22} />
                    </button>

                    {session ? (
                        <div className="flex items-center gap-4">
                            {session.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                                    <span className="font-bold text-xs uppercase">
                                        {session.user?.name?.substring(0, 1) || "U"}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="w-8 h-8 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors flex items-center justify-center"
                                title={t.nav_sign_out}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-primary text-sm font-medium rounded-full hover:bg-surface-variant transition-colors whitespace-nowrap"
                        >
                            <LogIn size={16} />
                            {t.nav_sign_in}
                        </button>
                    )}

                    <button className="md:hidden text-on-surface p-2 ml-2">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<div className="h-16" />}>
            <NavbarContent />
        </Suspense>
    );
}
