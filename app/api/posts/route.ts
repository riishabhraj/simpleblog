import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: { id: true, name: true, email: true, image: true }
                },
                tags: true,
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        })

        const totalPosts = await prisma.post.count({
            where: { published: true }
        })

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total: totalPosts,
                pages: Math.ceil(totalPosts / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { title, content, excerpt, tags, published = false } = body

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            )
        }

        // Create slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim()

        // Check if slug already exists
        let uniqueSlug = slug
        let counter = 1
        while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
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

        // Create post in Prisma
        const post = await prisma.post.create({
            data: {
                title,
                content,
                excerpt: excerpt || content.substring(0, 150) + "...",
                slug: uniqueSlug,
                published,
                authorId: session.user.id,
                tags: {
                    connect: tagConnections
                }
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true, image: true }
                },
                tags: true
            }
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }
}
