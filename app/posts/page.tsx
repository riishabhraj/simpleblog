"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenTool, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { PostCard } from "@/components/PostCard"

interface Post {
  id: string
  title: string
  content?: string // Add content for image extraction
  excerpt: string
  slug?: string
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
  tags: { name: string }[] | string[]
  _count?: {
    comments: number
    likes: number
  }
}

interface ApiResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Mock blog posts data with content for image extraction
const mockBlogPosts: Post[] = [
  {
    id: "mock-1",
    title: "The Art of Minimalist Writing",
    content: `# The Art of Minimalist Writing

![Clean minimalist workspace with notebook and pen](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80)

In a world filled with **information overload**, minimalist writing has become more important than ever...`,
    excerpt: "Discover how to convey powerful messages with fewer words. Learn the techniques that make your writing more impactful and engaging.",
    author: { id: "mock-1", name: "Sarah Chen", email: "sarah@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "SC" },
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    createdAt: "2024-01-15T00:00:00.000Z",
    tags: ["Writing", "Minimalism", "Tips"],
    likes: 24,
    comments: 8,
  },
  {
    id: "mock-2",
    title: "Building Better Habits",
    content: `# Building Better Habits Through Daily Writing

![Person writing in journal with coffee](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

How a simple daily writing practice can transform your life...`,
    excerpt: "How a simple daily writing practice can transform your life and help you develop better habits.",
    author: { id: "mock-2", name: "Marcus Johnson", email: "marcus@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "MJ" },
    publishedAt: "2024-01-14",
    readTime: "7 min read",
    createdAt: "2024-01-14T00:00:00.000Z",
    tags: ["Habits", "Productivity", "Growth"],
    likes: 42,
    comments: 15,
  },
  {
    id: "mock-3",
    title: "Digital Storytelling",
    content: `# The Future of Digital Storytelling

![Digital interface with storytelling elements](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80)

Exploring how technology is changing the way we tell stories...`,
    excerpt: "Exploring how technology is changing the way we tell stories and connect with audiences in the digital age.",
    author: { id: "mock-3", name: "Elena Rodriguez", email: "elena@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "ER" },
    publishedAt: "2024-01-13",
    readTime: "6 min read",
    createdAt: "2024-01-13T00:00:00.000Z",
    tags: ["Technology", "Storytelling", "Digital"],
    likes: 31,
    comments: 12,
  },
  {
    id: "mock-4",
    title: "Finding Your Writing Voice",
    content: `# Finding Your Unique Voice as a Writer

Every writer has a unique voice waiting to be discovered...`,
    excerpt: "Every writer has a unique voice waiting to be discovered. Here's how to find yours and let it shine.",
    author: { id: "mock-4", name: "David Kim", email: "david@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "DK" },
    publishedAt: "2024-01-12",
    readTime: "8 min read",
    createdAt: "2024-01-12T00:00:00.000Z",
    tags: ["Writing", "Voice", "Creativity"],
    likes: 56,
    comments: 23,
  },
  {
    id: "mock-5",
    title: "Psychology of Headlines",
    excerpt: "Understanding what makes readers click and how to craft headlines that capture attention without being clickbait.",
    author: { id: "mock-5", name: "Lisa Thompson", email: "lisa@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "LT" },
    publishedAt: "2024-01-11",
    readTime: "4 min read",
    createdAt: "2024-01-11T00:00:00.000Z",
    tags: ["Headlines", "Psychology", "Marketing"],
    likes: 38,
    comments: 9,
  },
  {
    id: "mock-6",
    title: "Writing in the AI Era",
    excerpt: "How artificial intelligence is changing the writing landscape and how writers can adapt and thrive.",
    author: { id: "mock-6", name: "Alex Rivera", email: "alex@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "AR" },
    publishedAt: "2024-01-10",
    readTime: "9 min read",
    createdAt: "2024-01-10T00:00:00.000Z",
    tags: ["AI", "Technology", "Future"],
    likes: 67,
    comments: 34,
  },
  {
    id: "mock-7",
    title: "Power of Personal Stories",
    excerpt: "Why sharing your personal experiences can create deeper connections with your audience and build relationships.",
    author: { id: "mock-7", name: "Maya Patel", email: "maya@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "MP" },
    publishedAt: "2024-01-09",
    readTime: "6 min read",
    createdAt: "2024-01-09T00:00:00.000Z",
    tags: ["Storytelling", "Personal", "Connection"],
    likes: 45,
    comments: 18,
  },
  {
    id: "mock-8",
    title: "Overcoming Writer's Block",
    excerpt: "Proven techniques to break through creative barriers and get your words flowing again when inspiration seems lost.",
    author: { id: "mock-8", name: "James Wilson", email: "james@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "JW" },
    publishedAt: "2024-01-08",
    readTime: "7 min read",
    createdAt: "2024-01-08T00:00:00.000Z",
    tags: ["Writing", "Creativity", "Productivity"],
    likes: 52,
    comments: 21,
  },
  {
    id: "mock-9",
    title: "Visual Storytelling in Blogs",
    excerpt: "How to use images, infographics, and visual elements to enhance your written content and engage readers.",
    author: { id: "mock-9", name: "Sophie Chang", email: "sophie@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "SC" },
    publishedAt: "2024-01-07",
    readTime: "5 min read",
    createdAt: "2024-01-07T00:00:00.000Z",
    tags: ["Visual", "Design", "Storytelling"],
    likes: 33,
    comments: 14,
  },
  {
    id: "mock-10",
    title: "Building Authentic Presence",
    excerpt: "Strategies for creating genuine connections with your audience while maintaining your authentic voice online.",
    author: { id: "mock-10", name: "Robert Garcia", email: "robert@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "RG" },
    publishedAt: "2024-01-06",
    readTime: "8 min read",
    createdAt: "2024-01-06T00:00:00.000Z",
    tags: ["Branding", "Authenticity", "Online"],
    likes: 41,
    comments: 16,
  },
  {
    id: "mock-11",
    title: "Science of Persuasive Writing",
    excerpt: "Understanding psychological principles that make writing more convincing and how to apply them ethically.",
    author: { id: "mock-11", name: "Dr. Amanda Foster", email: "amanda@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "AF" },
    publishedAt: "2024-01-05",
    readTime: "10 min read",
    createdAt: "2024-01-05T00:00:00.000Z",
    tags: ["Psychology", "Persuasion", "Science"],
    likes: 58,
    comments: 27,
  },
  {
    id: "mock-12",
    title: "Creating Character Arcs",
    excerpt: "Whether fiction or non-fiction, learn how to develop characters that readers care about and remember.",
    author: { id: "mock-12", name: "Isabella Martinez", email: "isabella@example.com", avatar: "/placeholder.svg?height=40&width=40", initials: "IM" },
    publishedAt: "2024-01-04",
    readTime: "9 min read",
    createdAt: "2024-01-04T00:00:00.000Z",
    tags: ["Characters", "Fiction", "Development"],
    likes: 39,
    comments: 19,
  },
]

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(6)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data: ApiResponse = await response.json()
        // Combine real posts with mock posts for demo
        const combinedPosts = [...data.posts, ...mockBlogPosts]
        setAllPosts(combinedPosts)
      } else {
        // Fallback to mock data if API fails
        setAllPosts(mockBlogPosts)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      // Fallback to mock data
      setAllPosts(mockBlogPosts)
    } finally {
      setIsLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">Loading...</div>
        </main>
      </div>
    )
  }

  // Calculate pagination
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = allPosts.slice(startIndex, endIndex)

  // Helper functions
  const getAuthorInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const calculateReadTime = (excerpt: string) => {
    const wordsPerMinute = 200
    const wordCount = excerpt.split(" ").length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const getTagName = (tag: string | { name: string }) => {
    return typeof tag === 'string' ? tag : tag.name
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePostsPerPageChange = (value: string) => {
    setPostsPerPage(Number(value))
    setCurrentPage(1)
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <UserNav />
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden">
          <UserNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-4xl">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                  Discover Amazing Stories
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400 px-4">
                  Explore a collection of thoughtful articles, personal stories, and insights from writers around the
                  world.
                </p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto max-w-xs">
                <Link href="/write">
                  <PenTool className="mr-2 h-4 w-4" />
                  Share Your Story
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Posts Controls */}
        <section className="w-full py-4 sm:py-6 border-b">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                {isLoading ? "Loading posts..." : `Showing ${startIndex + 1}-${Math.min(endIndex, totalPosts)} of ${totalPosts} posts`}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Posts per page:</span>
                <span className="text-sm text-gray-600 sm:hidden">Per page:</span>
                <Select value={postsPerPage.toString()} onValueChange={handlePostsPerPageChange}>
                  <SelectTrigger className="w-16 sm:w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="w-full py-8 sm:py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    getAuthorInitials={getAuthorInitials}
                    calculateReadTime={calculateReadTime}
                    getTagName={getTagName}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        <section className="w-full py-6 sm:py-8 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Page Numbers - Desktop */}
                <div className="hidden md:flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-gray-500 text-sm">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Page Numbers - Mobile/Tablet */}
                <div className="md:hidden flex items-center space-x-1">
                  {currentPage > 1 && (
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} className="w-8 h-8 text-xs">
                      1
                    </Button>
                  )}
                  {currentPage > 2 && <span className="text-gray-500 text-xs">...</span>}
                  <Button variant="default" size="sm" className="w-8 h-8 text-xs">
                    {currentPage}
                  </Button>
                  {currentPage < totalPages - 1 && <span className="text-gray-500 text-xs">...</span>}
                  {currentPage < totalPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 text-xs"
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>
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
