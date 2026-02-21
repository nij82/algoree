import { getTrendingVideosKR, rankHiddenGems } from './youtube';
import { YouTubeVideo } from '@/types/youtube';

/**
 * 발견 엔진 (Option 1): 고도화된 디스커버리 리스트 생성
 * 1. 가중치 기반 랭킹 (Engagement Rate)
 * 2. 크리에이터 교차 추천 (A->B)
 * 3. 세렌디피티 주입 (C)
 */
export async function getAdvancedDiscoveryList(
    userHistory: YouTubeVideo[],
    trendingPool: YouTubeVideo[],
    targetSize = 50
): Promise<YouTubeVideo[]> {
    // 1. 사용자 데이터 분석
    const watchedIds = new Set(userHistory.map(v => v.id));
    const knownChannelIds = new Set(userHistory.map(v => v.channelId));
    const userCategories = new Set(userHistory.map(v => v.categoryId));

    // 2. 필터링된 트렌드 풀 (이미 본 영상 제외)
    const freshTrending = trendingPool.filter(v => !watchedIds.has(v.id));

    // 3. 관심사 기반 교차 추천 (A->B 로직)
    // - 사용자가 본 주제(categoryId)와 같지만, 채널은 처음 보는 곳
    const interestBased = freshTrending.filter(v =>
        userCategories.has(v.categoryId) && !knownChannelIds.has(v.channelId)
    );

    // 4. 세렌디피티 주입 (C 로직)
    // - 사용자의 관심사가 아닌 카테고리에서 뜨는 영상
    const serendipityPool = freshTrending.filter(v => !userCategories.has(v.categoryId));

    // 5. 비중 조절 (관심사 80% : 세렌디피티 20%)
    const serendipitySize = Math.floor(targetSize * 0.2);
    const relevanceSize = targetSize - serendipitySize;

    // 6. 알고리즘 적용 및 태그 부여
    // rankHiddenGems 내부에 이미 가중치와 태그 생성 로직이 포함됨
    const processVideos = (videos: YouTubeVideo[], baseTag: string) => {
        return rankHiddenGems(videos).map(v => {
            const insightTags = [];

            // Insight 1: 처음보는 채널
            if (!knownChannelIds.has(v.channelId)) {
                insightTags.push("tag_new_channel");
            }

            // Insight 2: 진짜 인기 (좋아요 비율 7% 이상)
            const stats = v.statistics;
            if (stats) {
                const views = parseInt(stats.viewCount) || 1;
                const likes = parseInt(stats.likeCount) || 0;
                if (likes / views > 0.07) {
                    insightTags.push("tag_real_popular");
                }
            }

            return {
                ...v,
                tags: [baseTag, ...insightTags, ...(v.tags || [])].slice(0, 3) // 최대 3개까지 확장
            };
        });
    };

    const rankedInterests = processVideos(interestBased, "#내관심사");
    const rankedSerendipity = processVideos(serendipityPool, "#새로운시각");

    // 7. 최종 리스트 조합 및 셔플링
    const finalRelevance = rankedInterests.slice(0, relevanceSize);
    const finalSerendipity = rankedSerendipity.slice(0, serendipitySize);

    // 관심사가 부족하면    // 7. 최종 리스트 조합 및 셔플링
    const combined: YouTubeVideo[] = [...finalRelevance, ...finalSerendipity];

    if (combined.length < targetSize) {
        const remaining = freshTrending
            .filter(v => !combined.some(c => c.id === v.id))
            .slice(0, targetSize - combined.length);
        combined.push(...processVideos(remaining, "#트렌드"));
    }

    // 결과 셔플 (사용자 경험상 너무 정적인 것보다 매번 조금씩 다른 게 좋음)
    return combined.sort(() => Math.random() - 0.5);
}
