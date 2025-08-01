import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/tags - Get all tags
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { name: "asc" }
        })

        return NextResponse.json(tags)
    } catch (error) {
        console.error("Error fetching tags:", error)
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
    }
}
