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
                <div className="flex-[1] flex items-center justify-start">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-elevation-1 group-hover:scale-105 transition-transform">
                            <Compass className="text-on-primary" size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase text-on-surface group-hover:text-primary transition-colors hidden lg:block">
                            ALGO<span className="text-primary group-hover:text-on-surface">REE</span>
                        </span>
                    </Link>
                </div>

                {/* CENTER: Navigation Menu */}
                <div className="hidden md:flex flex-[2] items-center justify-center">
                    <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1.5 rounded-full border border-outline-variant shadow-elevation-1">
                        <Link
                            href="/discovery?tab=discovery"
                            className={clsx(
                                "px-6 py-2 text-sm font-bold rounded-full transition-all",
                                activeTab === 'discovery'
                                    ? "bg-primary text-on-primary shadow-elevation-2"
                                    : "text-on-surface-variant hover:text-primary hover:bg-primary-container"
                            )}
                        >
                            {t.nav_discovery}
                        </Link>
                        <Link
                            href="/discovery?tab=trends"
                            className={clsx(
                                "px-6 py-2 text-sm font-bold rounded-full transition-all",
                                activeTab === 'trends'
                                    ? "bg-primary text-on-primary shadow-elevation-2"
                                    : "text-on-surface-variant hover:text-primary hover:bg-primary-container"
                            )}
                        >
                            {t.nav_trends}
                        </Link>
                        <Link
                            href="/discovery?tab=gems"
                            className={clsx(
                                "px-6 py-2 text-sm font-bold rounded-full transition-all",
                                activeTab === 'gems'
                                    ? "bg-primary text-on-primary shadow-elevation-2"
                                    : "text-on-surface-variant hover:text-primary hover:bg-primary-container"
                            )}
                        >
                            {t.nav_gems}
                        </Link>
                    </div>
                </div>

                {/* RIGHT: Auth & Profile */}
                <div className="flex-[1] flex items-center justify-end gap-6">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container hidden sm:block">
                        <Search size={20} />
                    </button>

                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end text-right mr-1 hidden sm:flex">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none">{t.nav_member}</span>
                                <span className="text-xs font-black text-on-surface leading-tight">{session.user?.name}</span>
                            </div>
                            {session.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-10 h-10 rounded-full border-2 border-primary shadow-elevation-1 object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary">
                                    <span className="text-primary font-black text-xs uppercase">
                                        {session.user?.name?.substring(0, 2)}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="w-10 h-10 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-all flex items-center justify-center"
                                title={t.nav_sign_out}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-black rounded-full hover:bg-primary/90 transition-all shadow-elevation-2 active:scale-95 whitespace-nowrap"
                        >
                            <LogIn size={16} />
                            {t.nav_sign_in}
                        </button>
                    )}

                    <button className="md:hidden text-on-surface p-2">
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
