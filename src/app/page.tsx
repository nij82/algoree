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
  const [renderLimit, setRenderLimit] = useState(30);

  const loadFeed = async () => {
    setLoading(true);
    setRenderLimit(30);
    try {
      // Use new shorts strict endpoint if in shorts tab
      const endpoint = showShortsOnly ? `/api/discovery?tab=shorts_strict` : `/api/discovery?tab=${activeTab}`;
      const res = await fetch(endpoint);
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
    if (status !== 'loading') {
      loadFeed();
    }
  }, [status, activeTab, showShortsOnly]);

  const displayedVideos = videos; // Filtering is now handled directly by the API

  // Intersection Observer for Infinite Scroll Prefetching
  useEffect(() => {
    if (displayedVideos.length === 0 || renderLimit >= displayedVideos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add 30 more items smoothly
          setRenderLimit(prev => Math.min(prev + 30, displayedVideos.length));
        }
      },
      { rootMargin: '0px 0px 800px 0px' } // Trigger 800px before reaching the bottom
    );

    const target = document.querySelector('#scroll-trigger');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [renderLimit, displayedVideos.length]);

  const handleVideoSelect = (video: YouTubeVideo) => {
    router.push(`/watch/${video.id}`);
  };

  const handleSeen = (id: string, e: React.MouseEvent) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const handlePivot = async (id: string, e: React.MouseEvent) => {
    setLoading(true);
    try {
      const related = await getRelatedVideos(id, 30);
      setVideos(related);
      setRenderLimit(30);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

    </div>
  );

  if (status === 'loading') {
    return <div className="min-h-screen bg-background pt-24 px-6 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 pb-32">

      {status === 'authenticated' && <TabMenu />}

      <>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
            {[...Array(20)].map((_, i) => (
              <VideoCardSkeleton key={i} isShort={showShortsOnly} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
              {displayedVideos.slice(0, renderLimit).map((video, index) => (
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
                    rank={(activeTab === 'trends' && !showShortsOnly) ? index + 1 : undefined}
                  />
                </div>
              ))}
              {displayedVideos.length === 0 && (
                <div className="col-span-full py-20 text-center text-on-surface-variant">
                  조건에 맞는 영상이 없습니다.
                </div>
              )}
            </div>

            {/* Infinite Scroll Trigger & Minimal Loading Bar */}
            {renderLimit < displayedVideos.length && (
              <div id="scroll-trigger" className="w-full flex justify-center py-8">
                <div className="h-0.5 w-24 bg-surface-container-highest rounded overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-primary animate-slide-right" />
                </div>
              </div>
            )}
          </div>
        )}
      </>
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
