import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-v5"
import { prisma } from "@/lib/prisma"

// POST /api/posts/[id]/like - Toggle like on a post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const postId = id
        const userId = session.user.id

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Check if user already liked this post
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        })

        if (existingLike) {
            // Unlike the post
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            })

            // Get updated like count
            const likeCount = await prisma.like.count({
                where: { postId }
            })

            return NextResponse.json({
                liked: false,
                likeCount
            })
        } else {
            // Like the post
            await prisma.like.create({
                data: {
                    userId,
                    postId
                }
            })

            // Get updated like count
            const likeCount = await prisma.like.count({
                where: { postId }
            })

            return NextResponse.json({
                liked: true,
                likeCount
            })
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
    }
}

// GET /api/posts/[id]/like - Get like status and count
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const { id } = await params
        const postId = id

        // Get like count
        const likeCount = await prisma.like.count({
            where: { postId }
        })

        let liked = false
        if (session?.user?.id) {
            const existingLike = await prisma.like.findFirst({
                where: {
                    userId: session.user.id,
                    postId: postId
                }
            })
            liked = !!existingLike
        }

        return NextResponse.json({
            liked,
            likeCount
        })
    } catch (error) {
        console.error("Error fetching like status:", error)
        return NextResponse.json({ error: "Failed to fetch like status" }, { status: 500 })
    }
}
