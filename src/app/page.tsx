"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { getRelatedVideos } from '@/lib/youtube';
import { YouTubeVideo } from '@/types/youtube';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard';
import { Compass } from 'lucide-react';
import clsx from 'clsx';

function FeedContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 비로그인 시 강제로 trends, 로그인 시 URL 파라미터 또는 trends 기본값
  const activeTab = status === 'authenticated' ? (searchParams.get('tab') || 'trends') : 'trends';

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShortsOnly, setShowShortsOnly] = useState(false);

  const loadFeed = async () => {
    setLoading(true);
    try {
      // Antigra Refactoring: Always fetch from discovery API which handles trending for unauth
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

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/discovery?tab=categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadCategories();
    }
  }, [status]);

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
      <button
        onClick={() => { setShowShortsOnly(false); router.push(`/?tab=trends`); }}
        className={clsx(
          "px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
          (activeTab === 'trends' && !showShortsOnly) ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
        )}
      >
        실시간 인기
      </button>

      <button
        onClick={() => { setShowShortsOnly(true); router.push(`/?tab=trends`); }}
        className={clsx(
          "px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
          (showShortsOnly) ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
        )}
      >
        쇼츠
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => { setShowShortsOnly(false); router.push(`/?tab=cat_${cat.id}`); }}
          className={clsx(
            "px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
            (activeTab === `cat_${cat.id}`) ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
          )}
        >
          {cat.name}
        </button>
      ))}

      <button
        onClick={() => { setShowShortsOnly(false); router.push(`/?tab=about`); }}
        className={clsx(
          "px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
          (activeTab === 'about') ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
        )}
      >
        알고리 소개
      </button>
    </div>
  );

  if (status === 'loading') {
    return <div className="min-h-screen bg-background pt-24 px-6 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 pb-32">

      {status === 'authenticated' && <TabMenu />}

      {activeTab === 'about' ? (
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
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
              {[...Array(20)].map((_, i) => (
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
              {displayedVideos.length === 0 && (
                <div className="col-span-full py-20 text-center text-on-surface-variant">
                  조건에 맞는 영상이 없습니다.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <FeedContent />
    </Suspense>
  );
}
