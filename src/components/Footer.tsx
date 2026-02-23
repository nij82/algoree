"use client";

import { Compass } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="mt-32 pb-16 pt-24 border-t border-white/5 bg-[#0F0F0F]">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 opacity-70 group">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                            <Compass size={20} className="text-white group-hover:text-black" />
                        </div>
                        <span className="font-black tracking-widest uppercase italic text-white/60 group-hover:text-primary transition-colors text-sm">Algoree</span>
                    </div>
                    <p className="text-on-surface-variant text-xs font-medium max-w-xs mt-2">
                        알고리즘에서 벗어난 새로운 발견
                    </p>
                </div>

                <div className="text-center md:text-right space-y-2">
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                        Contact
                    </p>
                    <a href="mailto:tierrasea@gmail.com" className="text-sm font-black text-on-surface hover:text-primary transition-colors">
                        tierrasea@gmail.com
                    </a>
                </div>

                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-30">
                    &copy; {new Date().getFullYear()} Algoree Insight Engine
                </p>
            </div>
        </footer>
    );
}
