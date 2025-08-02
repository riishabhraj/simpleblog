import { NextRequest, NextResponse } from "next/server"

// POST /api/posts/[id]/share - Generate shareable link and increment share count
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { type = 'link' } = await request.json()
        const { id } = await params
        const postId = id

        // Get the post to create share data
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const shareUrl = `${baseUrl}/posts/${postId}`

        // Create different share URLs based on platform
        const shareLinks = {
            link: shareUrl,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this amazing blog post!`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            email: `mailto:?subject=Check out this blog post&body=I thought you might enjoy this: ${shareUrl}`
        }

        return NextResponse.json({
            shareUrl: shareLinks[type as keyof typeof shareLinks] || shareLinks.link,
            success: true
        })
    } catch (error) {
        console.error("Error generating share link:", error)
        return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 })
    }
}
