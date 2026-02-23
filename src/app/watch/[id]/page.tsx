"use client";

import { useEffect, useState, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { rankHiddenGems } from '@/lib/youtube';
import { YouTubeVideo } from '@/types/youtube';
import { useTranslation } from '@/hooks/useTranslation';
import {
    ChevronLeft,
    ThumbsUp,
    Eye,
    Calendar,
    Share2,
    MessageSquare,
    MoreVertical,
    Gem,
    Compass,
    Sparkles
} from 'lucide-react';
import { VideoCardSkeleton } from '@/components/VideoCard';
import clsx from 'clsx';

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { t, lang } = useTranslation();
    const [video, setVideo] = useState<YouTubeVideo | null>(null);
    const [recommendations, setRecommendations] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(true);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            if (!id) return;
            setLoading(true);
            setRecLoading(true);
            setError(null);

            try {
                // 🛠️ USE PROXY FOR DETAILS
                const detailsRes = await fetch(`/api/youtube?action=details&ids=${id}`);
                const details = await detailsRes.json();

                if (!detailsRes.ok) throw new Error(details.message || "Failed to fetch video coordinates");

                if (details.length > 0) {
                    setVideo(details[0]);
                } else {
                    setError("Video identifiers not detected in this quadrant.");
                }

                // 🛠️ USE PROXY FOR RELATED
                const relatedRes = await fetch(`/api/youtube?action=related&videoId=${id}`);
                const related = await relatedRes.json();

                if (relatedRes.ok) {
                    const ranked = rankHiddenGems(related);
                    setRecommendations(ranked);
                }

            } catch (err: any) {
                console.error('Watch Page Error:', err);
                setError(err.message || "A rift in the discovery protocol occurred.");
            } finally {
                setLoading(false);
                setRecLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12 animate-pulse">
                <div className="aspect-video bg-surface-container-highest rounded-[32px]" />
                <div className="space-y-6">
                    <div className="h-10 bg-surface-container-highest rounded-full w-3/4" />
                    <div className="h-6 bg-surface-container-highest rounded-full w-1/4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-24 h-24 bg-error-container rounded-[32px] flex items-center justify-center mb-8 border border-error/20 shadow-elevation-2">
                    <Compass size={48} className="text-error" />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-on-surface">Coordinate Lost</h2>
                <p className="text-on-surface-variant max-w-md mb-10 font-medium font-sans">
                    {error} Check if your YouTube API key is correctly configured.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-10 py-4 bg-primary text-on-primary font-black rounded-full hover:bg-primary/90 transition-all shadow-elevation-2 active:scale-95 uppercase tracking-tight"
                >
                    {t.watch_back}
                </button>
            </div>
        );
    }

    if (!video) return null;

    const stats = video.statistics;
    const views = parseInt(stats?.viewCount || '0').toLocaleString();
    const likes = parseInt(stats?.likeCount || '0').toLocaleString();
    const date = new Date(video.publishedAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-[1700px] mx-auto p-4 md:p-8 pb-32">
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 mb-8 text-on-surface-variant hover:text-primary transition-colors font-black uppercase tracking-widest text-xs"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                {t.watch_back}
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Player & Info */}
                <div className="flex-1 space-y-8">
                    {/* Cinema Player */}
                    <div className="relative aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden shadow-elevation-4 border-4 border-outline-variant bg-black group/player">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`}
                            title={video.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Metadata Header */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight uppercase italic">{video.title}</h1>

                        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-outline-variant/30">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-elevation-1">
                                    <Gem size={28} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-primary uppercase tracking-widest">{video.channelTitle}</p>
                                    <p className="text-xs text-on-surface-variant font-bold">{t.modal_verified}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-6 py-4 bg-surface-container-high rounded-full border border-outline-variant/50 text-on-surface">
                                    <ThumbsUp size={18} className="text-primary" />
                                    <span className="font-black text-sm">{likes}</span>
                                </div>
                                <button className="p-4 bg-surface-container-high rounded-full border border-outline-variant/50 text-on-surface hover:bg-primary hover:text-on-primary transition-all">
                                    <Share2 size={18} />
                                </button>
                                <button className="p-4 bg-surface-container-high rounded-full border border-outline-variant/50 text-on-surface hover:bg-primary hover:text-on-primary transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Stats & Description Box */}
                        <div className="p-8 bg-surface-container-low rounded-[40px] border border-outline-variant/50 space-y-6">
                            <div className="flex flex-wrap gap-8 text-sm font-black text-on-surface uppercase tracking-tighter">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-primary" />
                                    <span>{views} {t.card_views}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    <span>{date}</span>
                                </div>
                            </div>

                            <div className={clsx(
                                "text-on-surface-variant text-base leading-relaxed whitespace-pre-wrap font-medium overflow-hidden transition-all duration-500",
                                !isDescExpanded && "max-h-24 mask-fade-bottom"
                            )}>
                                {video.description}
                            </div>

                            <button
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                className="text-xs font-black uppercase text-primary hover:underline tracking-widest"
                            >
                                {isDescExpanded ? 'Show Less' : 'Show More...'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Beyond the Bubble */}
                <div className="lg:w-[400px] space-y-8">
                    <div className="pb-4 border-b border-outline-variant">
                        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 font-sans">
                            <Sparkles size={14} fill="currentColor" />
                            {t.modal_beyond_bubble}
                        </div>
                        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Nearby Coordinates</h2>
                    </div>

                    <div className="space-y-6">
                        {recLoading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-32 aspect-video bg-surface-container-highest rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3 bg-surface-container-highest rounded-full w-full" />
                                        <div className="h-2 bg-surface-container-highest rounded-full w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            recommendations.map(rec => (
                                <div
                                    key={rec.id}
                                    onClick={() => router.push(`/watch/${rec.id}`)}
                                    className="group flex gap-4 cursor-pointer hover:bg-surface-container-high/50 p-2 rounded-2xl transition-all"
                                >
                                    <div className="relative w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-black shadow-elevation-1 group-hover:shadow-elevation-2">
                                        <img
                                            src={rec.thumbnail}
                                            alt={rec.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 py-1 space-y-1">
                                        <h4 className="text-sm font-black line-clamp-2 text-on-surface group-hover:text-primary transition-colors leading-snug uppercase italic">
                                            {rec.title}
                                        </h4>
                                        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter">
                                            {rec.channelTitle}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
