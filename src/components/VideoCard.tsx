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
        <div className="flex flex-col gap-6 p-5 rounded-xl bg-surface border border-outline/5 animate-pulse">
            <div className="aspect-video rounded-xl bg-surface-container-highest border border-outline-variant/10" />
            <div className="flex gap-4 px-1">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface-container-highest" />
                <div className="flex-1 space-y-4">
                    <div className="h-4 bg-surface-container-highest rounded-full w-5/6" />
                    <div className="space-y-2.5">
                        <div className="h-3 bg-surface-container-highest rounded-full w-3/5" />
                        <div className="h-2.5 bg-surface-container-highest rounded-full w-1/3" />
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
                "group flex flex-col gap-5 p-5 rounded-xl transition-all duration-300 cursor-pointer bg-surface border border-transparent hover-glow",
                "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] active:scale-[0.98]",
                isSelected
                    ? "ring-2 ring-primary bg-primary-container shadow-elevation-3 border-primary/20"
                    : "hover:bg-surface-variant shadow-elevation-1"
            )}
        >
            {/* Thumbnail Container */}
            <div
                onClick={(e) => { e.stopPropagation(); onClick(video); }}
                className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-low border border-outline/5"
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-2.5 right-2.5 flex flex-wrap justify-end gap-1.5 max-w-[80%]">
                    {isGem && (
                        <div className="px-2.5 py-1 bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-black rounded-lg flex items-center gap-1 shadow-sm border border-white/10">
                            <Gem size={10} />
                            {video.gemScore}
                        </div>
                    )}
                    {video.tags?.slice(0, 2).map(tag => {
                        const translatedTag = (t as any)[tag] || tag;
                        const isInsight = tag.startsWith('tag_');
                        return (
                            <span
                                key={tag}
                                className={clsx(
                                    "px-2 py-1 backdrop-blur-md text-[9px] font-bold rounded-lg border uppercase tracking-wider",
                                    isInsight
                                        ? "bg-rose-500/60 text-white border-rose-400/30"
                                        : "bg-black/40 text-white border-white/10"
                                )}
                            >
                                {translatedTag.replace('#', '')}
                            </span>
                        );
                    })}
                </div>

                {/* Quick Actions Overlay (M3 Style) */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSeen(video.id, e); }}
                        className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90"
                        title={t.card_seen}
                    >
                        <EyeOff size={18} />
                    </button>
                    {/* Play Button Area - Now explicitly triggers onClick */}
                    <div
                        onClick={(e) => { e.stopPropagation(); onClick(video); }}
                        className="w-12 h-12 bg-primary text-on-primary rounded-full shadow-elevation-3 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer active:scale-95"
                    >
                        <Play size={24} fill="currentColor" />
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPivot(video.id, e); }}
                        className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all active:scale-90"
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
                            "font-bold text-[17px] leading-[1.35] line-clamp-2 transition-colors cursor-pointer tracking-tight",
                            isSelected ? "text-on-primary-container" : "text-on-surface group-hover:text-primary"
                        )}
                    >
                        {video.title}
                    </h3>
                    <div className="mt-2.5 flex flex-col gap-1">
                        <p className="text-[14px] text-[#AAAAAA] font-semibold truncate hover:text-on-surface transition-colors">
                            {video.channelTitle}
                        </p>
                        <div className="flex items-center text-[12px] text-[#AAAAAA]/60 font-medium">
                            <span>{parseInt(video.statistics?.viewCount || "0").toLocaleString()} {t.card_views}</span>
                            <span className="mx-2 opacity-30">•</span>
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
