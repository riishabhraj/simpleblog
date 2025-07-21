"use client"

import type { Session } from "next-auth"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, PenTool } from "lucide-react"
import Link from "next/link"

/**
 * Runtime-safe helper – returns the session object or null
 * even if `useSession` is not initialised or still undefined
 */
function safeSession(): Session | null {
    // 1️⃣ `useSession` isn’t a function (next-auth not available)
    const result = useSession()

    if (typeof useSession !== "function") return null

    // 2️⃣ useSession() itself might throw if a provider is missing
    try {
        // 3️⃣ Returned value can be undefined when there’s no provider
        //    so we guard before reading `.data`
        if (result && typeof result === "object" && "data" in result) {
            return (result as { data: Session | null }).data
        }
    } catch {
        // ignore – will fall through to “signed-out”
    }

    return null
}

export function UserNav() {
    const session = safeSession()

    /* ---------- Signed-out UI ---------- */
    if (!session?.user) {
        return (
            <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                    <Link href="/register">Sign Up</Link>
                </Button>
            </div>
        )
    }

    /* ---------- Signed-in UI ---------- */
    const initials =
        session.user.name
            ?.split(" ")
            .map((s) => s[0])
            .join("")
            .toUpperCase() || "U"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/write" className="cursor-pointer">
                        <PenTool className="mr-2 h-4 w-4" />
                        <span>Write Post</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Posts</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault()
                        if (typeof signOut === "function") signOut({ callbackUrl: "/" })
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

