"use client";

import { Compass } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="mt-32 pb-16 pt-24 border-t border-outline-variant/30 bg-surface">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 group">
                    <div className="w-8 h-8 bg-surface-container-highest rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Compass size={20} className="text-on-surface group-hover:text-on-primary" />
                    </div>
                    <span className="font-black tracking-widest uppercase italic text-on-surface/60 group-hover:text-primary transition-colors text-sm">{t.footer_freedom}</span>
                </div>

                <p className="text-on-surface-variant text-sm font-bold">
                    &copy; {new Date().getFullYear()} <span className="text-primary font-black uppercase tracking-tighter italic">Algoree</span> {t.footer_protocol}
                </p>

                <div className="flex gap-10">
                    <a href="#" className="text-xs font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em]">{t.footer_privacy}</a>
                    <a href="#" className="text-xs font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em]">{t.footer_terms}</a>
                    <a href="#" className="text-xs font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em]">{t.footer_help}</a>
                </div>
            </div>
        </footer>
    );
}
