import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// GET /api/user/profile - Get current user's profile
export async function GET() {
    try {
        const session = await getServerSession()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Return with additional fields that may not exist yet in DB
        return NextResponse.json({
            ...user,
            bio: null,
            website: null,
            location: null,
            twitter: null
        })
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

// PUT /api/user/profile - Update current user's profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, bio, website, location, twitter } = body

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        // Validate website URL if provided
        if (website && website.trim().length > 0) {
            try {
                new URL(website.startsWith('http') ? website : `https://${website}`)
            } catch {
                return NextResponse.json(
                    { error: "Please provide a valid website URL" },
                    { status: 400 }
                )
            }
        }

        // For now, only update name until the database schema is updated
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name.trim(),
                // TODO: Add these fields once database is updated
                // bio: bio?.trim() || null,
                // website: website?.trim() || null,
                // location: location?.trim() || null,
                // twitter: twitter?.trim() || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                updatedAt: true
            }
        })

        // Return with the additional fields (simulated for now)
        return NextResponse.json({
            ...updatedUser,
            bio: bio?.trim() || null,
            website: website?.trim() || null,
            location: location?.trim() || null,
            twitter: twitter?.trim() || null
        })
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
