import { YouTubeVideo } from '@/types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

export async function getTrendingVideos(regionCode = 'US', maxResults = 50): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode,
        maxResults: maxResults.toString(),
        key: API_KEY || '',
    });

    const res = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "YouTube API trending fetch failed");
    }

    return data.items?.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
    })) || [];
}

export async function getRelatedVideos(videoId: string, maxResults = 10, videoTitle?: string): Promise<YouTubeVideo[]> {
    // Note: relatedToVideoId is deprecated/restricted. 
    // We use keyword search as a more reliable way to find "related" content.
    const query = videoTitle || videoId;

    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        key: API_KEY || '',
    });

    const res = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "YouTube API search failed");
    }

    return data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
    })) || [];
}

export async function getUserHistory(accessToken: string, maxResults = 50): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
        part: 'snippet,contentDetails',
        mine: 'true',
        maxResults: maxResults.toString(),
        type: 'watch', // Filter for watch activities
    });

    const res = await fetch(`${YOUTUBE_API_BASE_URL}/activities?${params}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.error('YouTube API Error:', error);
        return [];
    }

    const data = await res.json();

    return data.items?.map((item: any) => ({
        id: item.contentDetails?.watch?.videoId || item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
    })).filter((v: any) => v.id) || [];
}

/**
 * 필터 유틸리티: 전체 비디오 목록에서 사용자가 이미 본 동영상을 제거한다.
 */
export function filterWatchedVideos(allVideos: YouTubeVideo[], watchedVideos: YouTubeVideo[]): YouTubeVideo[] {
    const watchedIds = new Set(watchedVideos.map(v => v.id));
    return allVideos.filter(v => !watchedIds.has(v.id));
}

import { supabase } from './supabase';

/**
 * 한국 트렌드 100개를 가져온다. 
 * Supabase의 'trending_pool' 테이블에서 캐시된 데이터를 먼저 확인한다.
 * 캐시가 없거나 1시간이 지났으면 YouTube API를 호출하고 Supabase를 업데이트한다.
 */
export async function getTrendingVideosKR(): Promise<YouTubeVideo[]> {
    // 1. Supabase 캐시 확인
    const { data: cache } = await supabase
        .from('trending_pool')
        .select('*')
        .single();

    if (cache && (new Date().getTime() - new Date(cache.updated_at).getTime() < 3600000)) {
        return cache.data as YouTubeVideo[];
    }

    // 2. 캐시 없거나 만료됨 -> YouTube API 호출
    const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'KR',
        maxResults: '50',
        key: API_KEY || '',
    });

    const res1 = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);
    const data1 = await res1.json();

    if (!res1.ok) {
        throw new Error(data1.error?.message || "YouTube API Trending KR fetch failed");
    }

    let items = data1.items || [];

    if (data1.nextPageToken) {
        params.set('pageToken', data1.nextPageToken);
        const res2 = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);
        const data2 = await res2.json();

        if (!res2.ok) {
            throw new Error(data2.error?.message || "YouTube API Trending KR (page 2) fetch failed");
        }

        items = [...items, ...(data2.items || [])];
    }

    const videos: YouTubeVideo[] = items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        categoryId: item.snippet.categoryId,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        statistics: item.statistics,
    }));

    // 3. Supabase 캐시 업데이트 (upsert)
    await supabase.from('trending_pool').upsert([{
        id: 'kr_trends',
        data: videos,
        updated_at: new Date().toISOString()
    }]);

    return videos;
}

/**
 * 비디오 아이디 목록으로 상세 통계를 포함한 정보를 가져온다.
 */
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) return [];

    const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
        key: API_KEY || '',
    });

    const res = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "YouTube API detail fetch failed");
    }

    return data.items?.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        categoryId: item.snippet.categoryId,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        statistics: item.statistics,
    })) || [];
}

/**
 * '숨겨진 보석' 가중치 알고리즘:
 * 1. Like/View 비율 (Engagement) - 기본 가중치
 * 2. Comment/View 비율 (Active Participation) - 추가 가중치
 * 3. Recent Surge (업로드 대비 조회수 추이 등 - 현재는 단순 비율로 대체)
 */
export function rankHiddenGems(videos: YouTubeVideo[]): YouTubeVideo[] {
    const now = new Date();

    return videos.map(video => {
        const stats = video.statistics;
        if (!stats) return { ...video, gemScore: 0 };

        const views = parseInt(stats.viewCount) || 1;
        const likes = parseInt(stats.likeCount) || 0;
        const comments = parseInt(stats.commentCount) || 0;

        // 가중치 계산 (100점 만점 기준 베이스 점수)
        const likeRatio = (likes / views) * 1000;
        const commentRatio = (comments / views) * 5000;

        // 신규성(Freshness) 가중치: 24시간 이내 영상에 보너스
        const publishedAt = new Date(video.publishedAt);
        const hoursSinceUpload = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
        const freshnessBoost = hoursSinceUpload < 24 ? 1.5 : (hoursSinceUpload < 72 ? 1.2 : 1.0);

        // 조회수가 너무 많은(대형 채널) 영상은 보석 점수에서 패널티
        const sizePenalty = views > 1000000 ? 0.7 : (views > 100000 ? 0.9 : 1.1);

        const gemScore = (likeRatio * 0.5 + commentRatio * 0.5) * sizePenalty * freshnessBoost;

        // 태그 생성 로직
        const tags = [];
        if (sizePenalty > 1.0) tags.push("#신생채널");
        if (freshnessBoost > 1.2) tags.push("#지금뜨는중");
        if (gemScore > 60) tags.push("#숨겨진보석");
        if (likeRatio > 50) tags.push("#높은만족도");
        if (tags.length === 0) tags.push("#새로운시각");

        return {
            ...video,
            gemScore: parseFloat(gemScore.toFixed(2)),
            tags: tags.slice(0, 2) // 최대 2개만 표시
        };
    }).sort((a, b) => (b.gemScore || 0) - (a.gemScore || 0));
}
