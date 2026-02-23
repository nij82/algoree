"use client";

import { Play, EyeOff, RefreshCw, Gem, MoreVertical } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube';
import clsx from 'clsx';

import { useTranslation } from '@/hooks/useTranslation';

interface VideoCardProps {
    video: YouTubeVideo;
    onSeen: (id: string, e: React.MouseEvent) => void;
    onPivot: (id: string, e: React.MouseEvent) => void;
    onClick: (video: YouTubeVideo) => void;
    isSelected?: boolean;
    rank?: number;
}

export function VideoCardSkeleton({ isShort }: { isShort?: boolean }) {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            <div className={clsx(
                "w-full rounded-xl bg-surface-container-highest",
                isShort ? "aspect-[9/16]" : "aspect-video"
            )} />
            <div className="flex gap-3 pr-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-container-highest" />
                <div className="flex-1 space-y-2 mt-1">
                    <div className="h-4 bg-surface-container-highest rounded w-5/6" />
                    <div className="h-3 bg-surface-container-highest rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

export default function VideoCard({ video, onSeen, onPivot, onClick, isSelected, rank }: VideoCardProps) {
    const isGem = video.gemScore && video.gemScore > 50;
    const { t } = useTranslation();

    return (
        <div
            onClick={() => onClick(video)}
            className="group flex flex-col gap-3 cursor-pointer"
        >
            {/* Thumbnail Container */}
            <div className={clsx(
                "relative w-full overflow-hidden bg-surface-container-low transition-all duration-300",
                video.isShort ? "aspect-[9/16] rounded-xl" : "aspect-video border-y border-outline-variant sm:border-x sm:rounded-xl",
                isSelected && "ring-2 ring-primary"
            )}>
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Ranking Badge */}
                {rank !== undefined && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white font-bold text-xs sm:text-sm px-2 py-1 rounded backdrop-blur-sm z-10 shadow-sm flex items-center justify-center min-w-[28px]">
                        {rank}
                    </div>
                )}

                {/* Duration Badge / Floating Badges */}
                <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1 z-10">
                    {/* Custom badges from earlier */}
                    <div className="flex gap-1 mb-1">
                        {isGem && (
                            <div className="px-1.5 py-0.5 bg-primary text-on-primary text-[10px] font-bold rounded">
                                GEM
                            </div>
                        )}
                        {video.tags?.slice(0, 1).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                                {(t as any)[tag]?.replace('#', '') || tag.replace('#', '')}
                            </span>
                        ))}
                    </div>
                    {/* YouTube Style Duration or Short indicator */}
                    {video.duration && (
                        <span className="px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                            {video.isShort ? "Shorts" : video.duration.replace("PT", "").toLowerCase()}
                        </span>
                    )}
                </div>

                {/* Quick Actions Overlay (Minimalist) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onSeen(video.id, e); }}
                            className="w-10 h-10 bg-white/90 text-black rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                            title={t.card_seen}
                        >
                            <EyeOff size={18} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onPivot(video.id, e); }}
                            className="w-10 h-10 bg-white/90 text-black rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                            title={t.card_pivot}
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex gap-3 px-1 sm:px-0">
                {/* Channel Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-on-surface-variant">
                        {video.channelTitle.substring(0, 1).toUpperCase()}
                    </span>
                </div>

                <div className="flex-1 min-w-0 pr-6 relative">
                    <h3 className={clsx(
                        "font-medium text-sm sm:text-base leading-tight line-clamp-2",
                        isSelected ? "text-primary" : "text-on-surface"
                    )}>
                        {video.title}
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-xs text-on-surface-variant gap-0.5 sm:gap-1">
                        <p className="truncate hover:text-on-surface transition-colors">
                            {video.channelTitle}
                        </p>
                        <div className="flex items-center">
                            <span className="hidden sm:inline mx-1">•</span>
                            <span>{parseInt(video.statistics?.viewCount || "0").toLocaleString()} {t.card_views}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <button className="absolute top-0 -right-2 p-1 text-on-surface-variant hover:text-on-surface hidden group-hover:block">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
