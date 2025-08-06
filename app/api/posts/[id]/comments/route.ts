import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const comments = await prisma.comment.findMany({
            where: { postId: id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ comments })
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        )
    }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json()
        const { content } = body

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            )
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id }
        })

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId: id,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error("Error creating comment:", error)
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        )
    }
}
