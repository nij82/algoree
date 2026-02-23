"use client";

import { useState, useEffect } from 'react';

type TranslationKeys = {
    // Navbar
    nav_discovery: string;
    nav_trends: string;
    nav_gems: string;
    nav_member: string;
    nav_sign_out: string;
    nav_sign_in: string;

    // Discovery Page
    hero_badge: string;
    hero_title: string;
    hero_title_accent: string;
    hero_desc: string;
    hero_desc_highlight: string;
    hero_btn: string;

    // Grid & Modal
    modal_protocol: string;
    modal_deep_dive: string;
    modal_beyond_bubble: string;
    modal_beyond_desc: string;
    modal_beyond_highlight: string;
    modal_loading: string;
    modal_verified: string;
    modal_next: string;

    // Watch Page
    watch_likes: string;
    watch_views: string;
    watch_uploaded: string;
    watch_description: string;
    watch_back: string;

    // Access & Loading
    access_denied: string;
    access_desc: string;
    access_btn: string;
    scanning_title: string;
    scanning_accent: string;
    scanning_desc: string;

    // Video Card
    card_gem: string;
    card_seen: string;
    card_pivot: string;
    card_views: string;
    tag_new_channel: string;
    tag_real_popular: string;
    btn_breaker: string;

    // Footer
    footer_freedom: string;
    footer_protocol: string;
    footer_privacy: string;
    footer_terms: string;
    footer_help: string;
};

const en: TranslationKeys = {
    nav_discovery: "Discovery",
    nav_trends: "Trends",
    nav_gems: "Gems",
    nav_member: "Member",
    nav_sign_out: "Sign Out",
    nav_sign_in: "SIGN IN",

    hero_badge: "Material Discovery 3.0",
    hero_title: "TOP 100",
    hero_title_accent: "DISCOVERY",
    hero_desc: "A curated sequence of deep-space coordinates.",
    hero_desc_highlight: "100 deep-space coordinates",
    hero_btn: "Recalibrate Axis",

    modal_protocol: "Synchronized Protocol",
    modal_deep_dive: "Deep-Dive Sequence",
    modal_beyond_bubble: "BEYOND THE BUBBLE",
    modal_beyond_desc: "Adjacent coordinates detected with low visibility / high engagement ratios.",
    modal_beyond_highlight: "low visibility / high engagement",
    modal_loading: "Decoding Meta-coordinates...",
    modal_verified: "COORDINATE VERIFIED",
    modal_next: "Next Discovery",

    watch_likes: "Likes",
    watch_views: "Views",
    watch_uploaded: "Uploaded",
    watch_description: "Description",
    watch_back: "Back to Discovery",

    access_denied: "Access Denied",
    access_desc: "The discovery engine requires a secure link to your profile to map unseen worlds.",
    access_btn: "Link Profile Account",
    scanning_title: "SCANNING",
    scanning_accent: "DEEP SPACE",
    scanning_desc: "VERIFYING COORDINATES BEYOND BUBBLE...",

    card_gem: "GEM",
    card_seen: "Mark as Seen",
    card_pivot: "Pivot Exploration",
    card_views: "views",
    tag_new_channel: "#NewChannel",
    tag_real_popular: "#RealPopular",
    btn_breaker: "Bubble Breaker",

    // Footer
    footer_freedom: "ALGORITHMIC FREEDOM",
    footer_protocol: "Discovery Protocol",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    footer_help: "Help",
};

const ko: TranslationKeys = {
    nav_discovery: "디스커버리",
    nav_trends: "트렌드",
    nav_gems: "숨은 보석",
    nav_member: "멤버",
    nav_sign_out: "로그아웃",
    nav_sign_in: "로그인",

    hero_badge: "머티리얼 디스커버리 3.0",
    hero_title: "TOP 100",
    hero_title_accent: "디스커버리",
    hero_desc: "취향의 지평을 넓혀줄 새로운 영상 리스트입니다.",
    hero_desc_highlight: "새로운 영상 리스트",
    hero_btn: "새로운 추천",

    modal_protocol: "동기화된 프로토콜",
    modal_deep_dive: "심층 탐사 시퀀스",
    modal_beyond_bubble: "버블 너머의 세계",
    modal_beyond_desc: "낮은 노출도와 높은 참여율을 가진 인접 영상을 발견했습니다.",
    modal_beyond_highlight: "낮은 노출도 / 높은 참여율",
    modal_loading: "새로운 영상을 찾고 있습니다...",
    modal_verified: "좌표 검증 완료",
    modal_next: "다음 발견으로 이동",

    watch_likes: "좋아요",
    watch_views: "조회수",
    watch_uploaded: "업로드",
    watch_description: "설명",
    watch_back: "디스커버리로 돌아가기",

    access_denied: "접근 거부됨",
    access_desc: "디스커버리 엔진은 보이지 않는 세계를 탐험하기 위해 프로필 연결이 필요합니다.",
    access_btn: "Google로 로그인",
    scanning_title: "탐색 중",
    scanning_accent: "새로운 세계",
    scanning_desc: "알고리즘 너머의 영상을 찾는 중입니다...",

    card_gem: "보석",
    card_seen: "본 영상으로 표시",
    card_pivot: "연관 동영상",
    card_views: "회",
    tag_new_channel: "#처음보는_채널",
    tag_real_popular: "#진짜_인기",
    btn_breaker: "새로운 발견",

    // Footer
    footer_freedom: "알고리즘으로부터의 자유",
    footer_protocol: "디스커버리 프로토콜",
    footer_privacy: "개인정보 처리방침",
    footer_terms: "이용약관",
    footer_help: "도움말",
};

export function useTranslation() {
    const [lang, setLang] = useState<'en' | 'ko'>('en');

    useEffect(() => {
        const userLang = navigator.language || (navigator as any).userLanguage;
        if (userLang.startsWith('ko')) {
            setLang('ko');
        } else {
            setLang('en');
        }
    }, []);

    const t = lang === 'ko' ? ko : en;

    return { t, lang };
}
