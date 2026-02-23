import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTrendingVideosKR, getUserHistory } from "@/lib/youtube";
import { getAdvancedDiscoveryList } from "@/lib/engine";

export async function GET(req: NextRequest) {
    try {
        // 🛠️ DEFINITIVE FIX: Use anySession to bypass Vercel type errors
        const session = await getServerSession(authOptions);
        const anySession = session as any;

        const { searchParams } = new URL(req.url);
        const tab = searchParams.get("tab") || "discovery";
        const trending = await getTrendingVideosKR();

        // 1. Trending Tab: Pure trending list (100 videos)
        if (tab === "trends" || (!anySession?.accessToken)) {
            const { getTrendsList } = await import("@/lib/engine");
            return NextResponse.json(await getTrendsList(trending));
        }

        // 2. Categories / History Logic for Auth Users
        const history = await getUserHistory(anySession.accessToken as string);

        // Dynamic categories extraction
        if (tab === "categories") {
            const { YOUTUBE_CATEGORIES } = await import("@/lib/youtube");

            // Extract top 5 categories from history
            const catCount: Record<string, number> = {};
            history.forEach(v => {
                if (v.categoryId) catCount[v.categoryId] = (catCount[v.categoryId] || 0) + 1;
            });

            // Sort by frequency
            const sortedIds = Object.entries(catCount)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            let topCategoryIds = sortedIds.slice(0, 5);

            // Fallback Logic: If history is not enough (less than 2 categories)
            if (topCategoryIds.length <= 1) {
                // 기본값: 자기계발(교육), 과학/기술, 뉴스/경제
                topCategoryIds = ["27", "28", "25"];
            }

            // Map IDs to Names
            const categories = topCategoryIds.map(id => ({
                id,
                name: YOUTUBE_CATEGORIES[id] || `기타(${id})`
            })).filter(cat => cat.name !== `기타(${cat.id})`); // 너무 마이너한 건 제외할 수 있음

            return NextResponse.json({ categories });
        }

        // 3. Category Filter
        if (tab.startsWith("cat_")) {
            const catId = tab.replace("cat_", "");
            // Filter trending or find related in that category? 
            // For now, filter trending pool by category
            return NextResponse.json(trending.filter(v => v.categoryId === catId));
        }

        const discoveryList = await getAdvancedDiscoveryList(history, trending);
        return NextResponse.json(discoveryList);
    } catch (error: any) {
        console.error("Discovery API Error Full:", error);
        return NextResponse.json({
            error: "Failed to fetch discovery feed",
            details: error.message
        }, { status: 500 });
    }
}
