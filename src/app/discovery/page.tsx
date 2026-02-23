"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { getRelatedVideos } from '@/lib/youtube';
import { YouTubeVideo } from '@/types/youtube';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard';
import { Compass } from 'lucide-react';
import clsx from 'clsx';

function DiscoveryContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // 비로그인 시 강제로 trends, 로그인 시 URL 파라미터 또는 trends 기본값
    const activeTab = status === 'authenticated' ? (searchParams.get('tab') || 'trends') : 'trends';

    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showShortsOnly, setShowShortsOnly] = useState(false);

    const loadFeed = async () => {
        setLoading(true);
        try {
            // maxResults를 100개로 요청 (API가 지원하도록 가정, 실제 구행 시 API 내부 로직이 처리)
            const res = await fetch(`/api/discovery?tab=${activeTab}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setVideos(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setLoading(false), 400);
        }
    };

    useEffect(() => {
        if (status !== 'loading' && activeTab !== 'about') {
            loadFeed();
        }
    }, [status, activeTab]);

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

    const displayedVideos = showShortsOnly ? videos.filter(v => v.isShort) : videos;

    const TabMenu = () => (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {['trends', 'discovery', 'gems', 'about'].map(tab => (
                <button
                    key={tab}
                    onClick={() => router.push(`/discovery?tab=${tab}`)}
                    className={clsx(
                        "px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
                        activeTab === tab
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                    )}
                >
                    {tab === 'trends' ? '트렌드' :
                        tab === 'discovery' ? '발견' :
                            tab === 'gems' ? '숨은 보석' : '알고리 소개'}
                </button>
            ))}
        </div>
    );

    if (status === 'loading') {
        return <div className="min-h-screen bg-background pt-24 px-6 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
    }

    if (activeTab === 'about' && status === 'authenticated') {
        return (
            <div className="max-w-4xl mx-auto pt-24 px-6 pb-32">
                <TabMenu />
                <div className="mt-12 space-y-8 text-center animate-fade-in-up">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-6">
                        <Compass size={40} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-on-surface tracking-tight">알고리즘의 굴레에서 벗어나<br />새로운 시각을 제공합니다.</h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                        Algoree는 당신이 항상 보던 것만 보여주는 추천 시스템에서 탈피하여,
                        진짜 가치 있는 숨겨진 보석과 완전히 새로운 분야의 트렌드를 발견할 수 있도록 돕는
                        미니멀리즘 비디오 탐색 플랫폼입니다.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1800px] mx-auto pt-24 px-4 sm:px-6 pb-32">

            {status === 'authenticated' && <TabMenu />}

            {/* Filters Section */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setShowShortsOnly(!showShortsOnly)}
                    className={clsx(
                        "px-4 py-1.5 rounded-full text-sm font-bold border transition-colors",
                        showShortsOnly
                            ? "border-primary bg-primary text-on-primary"
                            : "border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface"
                    )}
                >
                    {showShortsOnly ? '전체 보기' : '쇼츠만 보기'}
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
                    {[...Array(15)].map((_, i) => (
                        <VideoCardSkeleton key={i} isShort={showShortsOnly} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
                    {displayedVideos.map((video, index) => (
                        <div
                            key={video.id + index}
                            className="opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${(index % 20) * 30}ms` }}
                        >
                            <VideoCard
                                video={video}
                                onSeen={handleSeen}
                                onPivot={handlePivot}
                                onClick={handleVideoSelect}
                            />
                        </div>
                    ))}
                    {displayedVideos.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center text-on-surface-variant">
                            조건에 맞는 영상이 없습니다.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function DiscoveryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <DiscoveryContent />
        </Suspense>
    );
}
