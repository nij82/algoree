import { NextRequest, NextResponse } from "next/server";
import { getVideoDetails, getRelatedVideos } from "@/lib/youtube";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    try {
        if (action === 'details') {
            const ids = searchParams.get('ids')?.split(',') || [];
            if (ids.length === 0) return NextResponse.json([], { status: 400 });

            const details = await getVideoDetails(ids);
            return NextResponse.json(details);
        }

        if (action === 'related') {
            const videoId = searchParams.get('videoId');
            const title = searchParams.get('title') || '';
            if (!videoId) return NextResponse.json([], { status: 400 });

            const related = await getRelatedVideos(videoId, 12, title);
            return NextResponse.json(related);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("YouTube Proxy Error:", error);
        return NextResponse.json({
            error: "YouTube API Error",
            message: error.message
        }, { status: 500 });
    }
}
