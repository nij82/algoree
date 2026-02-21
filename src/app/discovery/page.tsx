"use client";

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { getRelatedVideos } from '@/lib/youtube';
import { YouTubeVideo } from '@/types/youtube';
import { useRouter } from 'next/navigation';
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard';
import { Sparkles, Compass, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DiscoveryPage() {
    const { data: session, status } = useSession();
    const { t } = useTranslation();
    const router = useRouter();
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFeed = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/discovery');
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setVideos(data);
        } catch (error) {
            console.error(error);
        } finally {
            // 부드러운 전환을 위해 약간의 지연 추가
            setTimeout(() => setLoading(false), 800);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            loadFeed();
        }
    }, [status]);

    const handleVideoSelect = (video: YouTubeVideo) => {
        router.push(`/watch/${video.id}`);
    };

    const handleSeen = (id: string, e: React.MouseEvent) => {
        setVideos(prev => prev.filter(v => v.id !== id));
    };

    const handlePivot = async (id: string, e: React.MouseEvent) => {
        setLoading(true);
        try {
            const related = await getRelatedVideos(id, 20);
            setVideos(related);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-24 h-24 bg-surface-container-high rounded-[32px] flex items-center justify-center mb-8 border border-outline-variant shadow-elevation-2">
                    <Compass size={48} className="text-primary" />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-on-surface">{t.access_denied}</h2>
                <p className="text-on-surface-variant max-w-md mb-10 font-medium font-sans">
                    {t.access_desc}
                </p>
                <button
                    onClick={() => signIn('google')}
                    className="px-10 py-4 bg-primary text-on-primary font-black rounded-full hover:bg-primary/90 transition-all shadow-elevation-2 active:scale-95 uppercase tracking-tight"
                >
                    {t.access_btn}
                </button>
            </div>
        );
    }

    // Loading State with Skeleton UI
    if (status === 'loading' || (loading && videos.length === 0)) {
        return (
            <div className="max-w-[1600px] mx-auto space-y-16 pb-32">
                <div className="h-64 rounded-[48px] bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center gap-6 animate-pulse">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-2xl" />
                    <div className="h-8 bg-surface-container-highest rounded-full w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(12)].map((_, i) => (
                        <VideoCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-32">
            <div className="space-y-16">
                {/* Hero Section (M3 Type) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-outline-variant">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-[11px] font-black uppercase tracking-widest shadow-elevation-1">
                            <Sparkles size={14} fill="currentColor" />
                            {t.hero_badge}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-7xl font-black tracking-tight leading-none uppercase text-on-surface">
                                {t.hero_title} <span className="text-primary italic">{t.hero_title_accent}</span>
                            </h1>
                            <p className="text-on-surface-variant text-lg font-medium max-w-2xl leading-relaxed">
                                {t.hero_desc.split(t.hero_desc_highlight)[0]}
                                <span className="text-on-surface underline decoration-primary decoration-2 underline-offset-4">{t.hero_desc_highlight}</span>
                                {t.hero_desc.split(t.hero_desc_highlight)[1]}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        <button
                            disabled={loading || videos.length === 0}
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setVideos(prev => [...prev].sort(() => Math.random() - 0.5));
                                    setLoading(false);
                                }, 800);
                            }}
                            className="group flex items-center gap-4 px-8 py-5 bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary rounded-full transition-all duration-500 shadow-elevation-1 hover:shadow-elevation-3 active:scale-95 border border-outline-variant disabled:opacity-50"
                        >
                            <Compass size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                            <span className="text-base font-black uppercase tracking-tight">{t.btn_breaker}</span>
                        </button>

                        <button
                            onClick={loadFeed}
                            className="group flex items-center gap-4 px-10 py-5 bg-primary text-on-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-elevation-2 hover:shadow-elevation-3 active:scale-95"
                        >
                            <span className="text-base font-black uppercase tracking-tight">{t.hero_btn}</span>
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        </button>
                    </div>
                </div>

                {/* Main Grid: 4 columns on PC, 1 on Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {videos.map(video => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onSeen={handleSeen}
                            onPivot={handlePivot}
                            onClick={handleVideoSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
