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

        // 1. Trends Tab: Pure trending list
        if (tab === "trends") {
            const { getTrendsList } = await import("@/lib/engine");
            return NextResponse.json(await getTrendsList(trending));
        }

        // 2. Gems Tab: Weighted hidden gems
        if (tab === "gems") {
            const { getGemsList } = await import("@/lib/engine");
            return NextResponse.json(await getGemsList(trending));
        }

        // 3. Discovery Tab (Default): Personalized filtering
        if (!anySession?.accessToken) {
            // Not logged in: Return shuffled trending
            return NextResponse.json(trending.sort(() => Math.random() - 0.5).slice(0, 50));
        }

        const history = await getUserHistory(anySession.accessToken as string);
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
