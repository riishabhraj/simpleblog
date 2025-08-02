import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-v5"
import { prisma } from "@/lib/prisma"

// GET /api/posts/[id] - Get single post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true, image: true }
                },
                tags: true,
                comments: {
                    include: {
                        author: {
                            select: { id: true, name: true, image: true }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                },
                _count: {
                    select: { comments: true }
                }
            }
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
    }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { title, content, excerpt, tags, published } = body

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            )
        }

        // Check if post exists and user is the author
        const existingPost = await prisma.post.findUnique({
            where: { id },
            include: { author: true }
        })

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Create slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim()

        // Check if slug already exists for different post
        let uniqueSlug = slug
        let counter = 1
        while (true) {
            const slugExists = await prisma.post.findUnique({
                where: { slug: uniqueSlug }
            })
            if (!slugExists || slugExists.id === id) {
                break
            }
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        // Handle tags
        const tagConnections = []
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                const tag = await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName }
                })
                tagConnections.push({ id: tag.id })
            }
        }

        // Update post
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                excerpt: excerpt || content.substring(0, 150) + "...",
                slug: uniqueSlug,
                published: published !== undefined ? published : existingPost.published,
                tags: {
                    set: [], // Clear existing tags
                    connect: tagConnections // Add new tags
                }
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true, image: true }
                },
                tags: true
            }
        })

        return NextResponse.json(updatedPost)
    } catch (error) {
        console.error("Error updating post:", error)
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Check if user owns the post
        const existingPost = await prisma.post.findUnique({
            where: { id },
            include: { author: true }
        })

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Delete post
        await prisma.post.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Post deleted successfully" })
    } catch (error) {
        console.error("Error deleting post:", error)
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }
}
