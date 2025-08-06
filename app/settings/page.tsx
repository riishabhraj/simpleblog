"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenTool, Save, User, Mail, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export default function SettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [bio, setBio] = useState("")
    const [website, setWebsite] = useState("")
    const [location, setLocation] = useState("")
    const [twitter, setTwitter] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            router.push("/signin?callbackUrl=/settings")
            return
        }

        // Load user profile
        const fetchProfile = async () => {
            if (!session?.user?.id) return

            try {
                setIsLoading(true)
                const response = await fetch('/api/user/profile')
                if (response.ok) {
                    const data = await response.json()
                    setName(data.name || "")
                    setEmail(data.email || "")
                    setBio(data.bio || "")
                    setWebsite(data.website || "")
                    setLocation(data.location || "")
                    setTwitter(data.twitter || "")
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [session, status, router])

    const handleSave = async () => {
        if (!session?.user?.id) return

        try {
            setIsSaving(true)
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    bio: bio.trim(),
                    website: website.trim(),
                    location: location.trim(),
                    twitter: twitter.trim(),
                }),
            })

            if (response.ok) {
                const updatedProfile = await response.json()

                // Update individual state variables instead of setProfile
                setName(updatedProfile.name || "")
                setBio(updatedProfile.bio || "")
                setWebsite(updatedProfile.website || "")
                setLocation(updatedProfile.location || "")
                setTwitter(updatedProfile.twitter || "")

                // Update the session with new name
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name: updatedProfile.name
                    }
                })

                alert("Profile updated successfully!")
            } else {
                const error = await response.json()
                alert(error.error || "Failed to update profile")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                    <Link className="flex items-center justify-center" href="/">
                        <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                        <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
                    </Link>
                    <nav className="ml-auto flex items-center">
                        <UserNav />
                    </nav>
                </header>
                <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">Loading...</div>
                </main>
            </div>
        )
    }

    if (!session) {
        return null // Will redirect
    }

    const userInitials = session.user.name
        ?.split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase() || "U"

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
                </Link>

                <nav className="ml-auto hidden md:flex gap-4 lg:gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/posts">
                        All Posts
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
                        Dashboard
                    </Link>
                    <UserNav />
                </nav>

                <div className="ml-auto md:hidden">
                    <UserNav />
                </div>
            </header>

            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Profile Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your profile information that will be displayed to other users.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Picture */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                        <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm" disabled>
                                            <Camera className="h-4 w-4 mr-2" />
                                            Change Photo
                                        </Button>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Photo changes are managed through your authentication provider
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Form Fields */}
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your display name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Email cannot be changed from here
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us a bit about yourself..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                placeholder="https://yourwebsite.com"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                placeholder="Your location"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="twitter">Twitter Username</Label>
                                        <Input
                                            id="twitter"
                                            placeholder="@username"
                                            value={twitter}
                                            onChange={(e) => setTwitter(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Account Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage your account security and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-medium mb-2">Authentication</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Your account is managed through your authentication provider.
                                        Password and security settings should be managed there.
                                    </p>
                                    <Button variant="outline" size="sm" disabled>
                                        Manage Authentication
                                    </Button>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-medium mb-2">Data Export</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Download a copy of your data including all your posts and comments.
                                    </p>
                                    <Button variant="outline" size="sm" disabled>
                                        Export Data
                                    </Button>
                                </div>

                                <div className="p-4 border rounded-lg border-red-200">
                                    <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Delete your account and all associated data permanently.
                                    </p>
                                    <Button variant="destructive" size="sm" disabled>
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
