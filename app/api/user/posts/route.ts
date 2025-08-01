import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-v5"
import { prisma } from "@/lib/prisma"

// GET /api/user/posts - Get current user's posts
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const posts = await prisma.post.findMany({
            where: { authorId: session.user.id },
            include: {
                tags: true,
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("Error fetching user posts:", error)
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}
