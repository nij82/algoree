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
}

export function VideoCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-[28px] bg-surface-container-low animate-pulse">
            <div className="aspect-video rounded-2xl bg-surface-container-highest border border-outline-variant/30" />
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-highest" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-surface-container-highest rounded-full w-3/4" />
                    <div className="space-y-2">
                        <div className="h-3 bg-surface-container-highest rounded-full w-1/2" />
                        <div className="h-2 bg-surface-container-highest rounded-full w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VideoCard({ video, onSeen, onPivot, onClick, isSelected }: VideoCardProps) {
    const isGem = video.gemScore && video.gemScore > 50;
    const { t } = useTranslation();

    return (
        <div
            onClick={() => onClick(video)}
            className={clsx(
                "group flex flex-col gap-4 p-4 rounded-[28px] transition-all duration-300 cursor-pointer bg-surface",
                isSelected ? "ring-4 ring-primary bg-primary-container shadow-elevation-3" : "hover:bg-surface-variant shadow-elevation-1 hover:shadow-elevation-2"
            )}
        >
            {/* Thumbnail Container */}
            <div
                onClick={(e) => { e.stopPropagation(); onClick(video); }}
                className="relative aspect-video rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant"
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Score Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isGem && (
                        <div className="px-3 py-1 bg-primary text-on-primary text-[10px] font-black rounded-full flex items-center gap-1 shadow-elevation-2">
                            <Gem size={12} />
                            {t.card_gem} {video.gemScore}
                        </div>
                    )}
                    <div className="flex gap-1">
                        {video.tags?.slice(0, 3).map(tag => {
                            const translatedTag = (t as any)[tag] || tag;
                            const isInsight = tag.startsWith('tag_');
                            return (
                                <span
                                    key={tag}
                                    className={clsx(
                                        "px-2 py-0.5 backdrop-blur-md text-[9px] font-bold rounded-full border uppercase tracking-wider",
                                        isInsight
                                            ? "bg-primary text-on-primary border-primary animate-pulse"
                                            : "bg-surface/80 text-on-surface border-outline-variant"
                                    )}
                                >
                                    {translatedTag.replace('#', '')}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 text-[10px] font-bold text-white rounded-md">
                    4:20
                </div>

                {/* Quick Actions Overlay (M3 Style) */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSeen(video.id, e); }}
                        className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
                        title={t.card_seen}
                    >
                        <EyeOff size={18} />
                    </button>
                    {/* Play Button Area - Now explicitly triggers onClick */}
                    <div
                        onClick={(e) => { e.stopPropagation(); onClick(video); }}
                        className="w-12 h-12 bg-primary text-on-primary rounded-full shadow-elevation-3 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer"
                    >
                        <Play size={24} fill="currentColor" />
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPivot(video.id, e); }}
                        className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all"
                        title={t.card_pivot}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-elevation-1">
                    <span className="text-xs font-black text-on-secondary-container">
                        {video.channelTitle.substring(0, 2).toUpperCase()}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        onClick={(e) => { e.stopPropagation(); onClick(video); }}
                        className={clsx(
                            "font-bold text-base leading-[1.3] line-clamp-2 transition-colors cursor-pointer",
                            isSelected ? "text-on-primary-container" : "text-on-surface group-hover:text-primary"
                        )}
                    >
                        {video.title}
                    </h3>
                    <div className="mt-2 flex flex-col gap-0.5">
                        <p className="text-sm text-on-surface-variant font-medium truncate">
                            {video.channelTitle}
                        </p>
                        <div className="flex items-center text-xs text-on-surface-variant/70 font-medium">
                            <span>{parseInt(video.statistics?.viewCount || "0").toLocaleString()} {t.card_views}</span>
                            <span className="mx-2 opacity-50">•</span>
                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button className="h-fit p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-highest">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
}
