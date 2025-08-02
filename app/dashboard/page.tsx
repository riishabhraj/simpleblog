"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Edit, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserNav } from "@/components/user-nav"
import { getCardImage } from "@/lib/blog-utils"

interface Post {
    id: string
    title: string
    excerpt: string
    content: string
    published: boolean
    createdAt: string
    tags: { name: string }[]
    _count: { comments: number }
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!session) {
            router.push("/signin")
            return
        }

        fetchUserPosts()
    }, [session, router])

    const fetchUserPosts = async () => {
        try {
            const response = await fetch("/api/user/posts")
            if (response.ok) {
                const data = await response.json()
                setPosts(data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setPosts(posts.filter(post => post.id !== postId))
            } else {
                alert("Failed to delete post")
            }
        } catch (error) {
            console.error("Error deleting post:", error)
            alert("Failed to delete post")
        }
    }

    if (!session) return null

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
                    <UserNav />
                </nav>

                <div className="ml-auto md:hidden">
                    <UserNav />
                </div>
            </header>

            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="container max-w-6xl mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">My Posts</h1>
                            <p className="text-gray-600 mt-1">Manage your blog posts and drafts</p>
                        </div>
                        <Button asChild>
                            <Link href="/write">
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading your posts...</div>
                    ) : posts.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Start sharing your thoughts with the world by creating your first post.
                                </p>
                                <Button asChild>
                                    <Link href="/write">
                                        <PenTool className="mr-2 h-4 w-4" />
                                        Write Your First Post
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <Card key={post.id} className="flex flex-col">
                                    {/* Post Image */}
                                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                        <Image
                                            src={getCardImage(post.content, post.title)}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <Badge variant={post.published ? "default" : "secondary"}>
                                                {post.published ? "Published" : "Draft"}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Link href={`/posts/${post.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Link href={`/write?edit=${post.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-lg">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3">
                                            {post.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 pt-0">
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag.name} variant="outline" className="text-xs">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{post.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 flex justify-between">
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span>{post._count.comments} comments</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
