export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  categoryId: string;
  publishedAt: string;
  description: string;
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  gemScore?: number; // 가중치 알고리즘으로 계산된 '숨겨진 보석' 점수
  tags?: string[]; // 발견 사유 태그 (예: #내관심사, #새로운시각)
}

export interface YouTubeTrendingResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
}
