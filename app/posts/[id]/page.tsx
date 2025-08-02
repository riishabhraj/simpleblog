"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenTool, Clock, Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { UserNav } from "@/components/user-nav"

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  createdAt: string
  publishedAt?: string
  readTime?: string
  likes?: number
  comments?: number
  author: {
    id: string
    name: string
    email: string
    image?: string
    avatar?: string
    initials?: string
  }
  tags: { name: string }[]
  _count: { comments: number }
}

// Mock post data (fallback for demo)
const getMockPost = (id: string) => {
  const posts = [
    {
      id: "mock-1",
      title: "The Art of Minimalist Writing",
      content: `# The Art of Minimalist Writing

![Clean minimalist workspace with notebook and pen](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80)

In a world filled with **information overload**, minimalist writing has become more important than ever. The ability to convey powerful messages with fewer words is not just a skill—it's an *art form* that can transform how your audience receives and processes your ideas.

Minimalist writing isn't about being lazy or cutting corners. It's about being **intentional** with every word you choose. When you strip away the unnecessary, what remains carries more weight, more meaning, and more impact.

## Key Principles to Embrace

### Clarity Over Complexity
Your readers shouldn't need a dictionary to understand your message. Choose simple, clear words that convey your meaning directly. If a simpler word works just as well as a complex one, always choose the simpler option.

### Show, Don't Tell
Instead of telling your readers that something is "very important," show them why it matters. Use:
* Concrete examples
* Vivid imagery
* Specific details that paint a picture

### Embrace White Space
Just as silence in music creates rhythm and emphasis, white space in writing gives your words room to breathe. Short paragraphs, bullet points, and strategic breaks help readers digest your content more easily.

> "The secret to good writing is to strip every sentence to its cleanest components." - William Zinsser

### Edit Ruthlessly
The first draft is never the final draft. Go through your writing multiple times, asking yourself:

1. Does this word serve a purpose?
2. Does this sentence add value?
3. Does this paragraph move the story forward?

If the answer is no, **cut it**.

## Tools for Minimalist Writers

Here are some helpful tools:
- [Hemingway Editor](https://hemingwayapp.com) - Highlights complex sentences
- [Grammarly](https://grammarly.com) - Catches grammar issues

Remember, minimalist writing is about maximizing impact while minimizing effort for your reader. Every word should earn its place on the page.`,
      excerpt: "Discover how to convey powerful messages with fewer words. Learn the techniques that make your writing more impactful and engaging.",
      slug: "art-of-minimalist-writing",
      author: {
        id: "mock-author-1",
        name: "Sarah Chen",
        email: "sarah@example.com",
        image: "/placeholder.svg",
      },
      createdAt: "2024-01-15T00:00:00.000Z",
      publishedAt: "2024-01-15T00:00:00.000Z",
      readTime: "5 min read",
      likes: 24,
      comments: 8,
      tags: [{ name: "Writing" }, { name: "Minimalism" }, { name: "Tips" }],
      _count: { comments: 8 }
    },
    {
      id: "mock-2",
      title: "Building Better Habits Through Daily Writing",
      content: `# Building Better Habits Through Daily Writing

![Person writing in journal with coffee](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

How a simple daily writing practice can transform your life and help you build lasting positive habits.

## The Power of Daily Practice

Writing every day, even just for 10 minutes, can create profound changes in your thinking patterns and overall well-being...`,
      excerpt: "How a simple daily writing practice can transform your life and help you build lasting positive habits.",
      slug: "building-better-habits",
      author: {
        id: "mock-author-2",
        name: "Marcus Johnson",
        email: "marcus@example.com",
        image: "/placeholder.svg",
      },
      createdAt: "2024-01-14T00:00:00.000Z",
      publishedAt: "2024-01-14T00:00:00.000Z",
      readTime: "7 min read",
      likes: 42,
      comments: 15,
      tags: [{ name: "Habits" }, { name: "Productivity" }, { name: "Personal Growth" }],
      _count: { comments: 15 }
    }
  ]

  return posts.find((post) => post.id === id)
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchPost() {
      try {
        const { id } = await params
        setIsLoading(true)

        // Try to fetch from API first
        const response = await fetch(`/api/posts/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          // Fallback to mock data
          const mockPost = getMockPost(id)
          if (mockPost) {
            setPost(mockPost)
          } else {
            setNotFound(true)
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        // Fallback to mock data
        const { id } = await params
        const mockPost = getMockPost(id)
        if (mockPost) {
          setPost(mockPost)
        } else {
          setNotFound(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      fetchPost()
    }
  }, [params, mounted])

  const getAuthorInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const formatDate = (dateString: string) => {
    if (!mounted) return "" // Prevent hydration mismatch
    return new Date(dateString).toLocaleDateString()
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center">Loading post...</div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Post Not Found</h1>
        <Link href="/posts">
          <Button>Back to Posts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-4 lg:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/posts">
            All Posts
          </Link>
          <UserNav />
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden">
          <UserNav />
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4 py-4 sm:py-8">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <Link href="/posts" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Back to Posts
            </Link>
          </div>

          <Card>
            <CardHeader className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
              {/* Post Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{post.title}</h1>

              {/* Author Info */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={post.author.avatar || post.author.image || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback className="text-sm sm:text-base">
                    {post.author.initials || getAuthorInitials(post.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium text-sm sm:text-base">{post.author.name}</span>
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-1 sm:gap-2">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime || calculateReadTime(post.content)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.name} variant="secondary" className="text-xs sm:text-sm">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              {/* Engagement Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{post.likes || 0} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{post.comments || post._count.comments} comments</span>
                </div>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs sm:text-sm">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownRenderer content={post.content} className="leading-relaxed text-sm sm:text-base" />
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-6 sm:mt-8 text-center">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Enjoyed this post?</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Share your own stories and connect with other writers.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/write">
                  <PenTool className="mr-2 h-4 w-4" />
                  Start Writing
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-4 sm:py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
          © 2024 SimpleBlog. Made for writers, by writers.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
