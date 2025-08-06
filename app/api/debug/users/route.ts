import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// GET /api/debug/users - Debug endpoint to check users
export async function GET() {
    try {
        const session = await getServerSession()
        console.log("Current session:", JSON.stringify(session, null, 2))

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            session,
            users,
            userCount: users.length
        })
    } catch (error) {
        console.error("Error in debug endpoint:", error)
        return NextResponse.json({ error: "Failed to fetch debug info" }, { status: 500 })
    }
}
