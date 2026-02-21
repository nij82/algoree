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

        const trending = await getTrendingVideosKR();

        if (!anySession?.accessToken) {
            // Not logged in: Return default ranked list
            return NextResponse.json(trending.sort(() => Math.random() - 0.5).slice(0, 50));
        }

        // 2. Fetch User History
        const history = await getUserHistory(anySession.accessToken as string);

        // 3. User Advanced Discovery Engine
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
