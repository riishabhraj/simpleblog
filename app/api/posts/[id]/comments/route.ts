import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/posts/[id]/comments - Create comment
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { content } = body

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            )
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: params.id }
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: params.id,
                authorId: session.user.id
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            }
        })

        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error("Error creating comment:", error)
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
    }
}
