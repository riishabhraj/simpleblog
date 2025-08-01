"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PenTool, Save, Send, X, Plus } from "lucide-react"
import Link from "next/link"
import { MarkdownEditor } from "@/components/markdown-editor"

interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  published: boolean
  tags: { name: string }[]
  author: {
    id: string
    name: string
    email: string
    image?: string
  }
  createdAt: string
  updatedAt: string
}

function WritePageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [originalPost, setOriginalPost] = useState<Post | null>(null)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/signin?callbackUrl=/write")
      return
    }
  }, [session, status, router])

  // Handle edit mode
  useEffect(() => {
    const fetchPostForEdit = async (postId: string) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/${postId}`)
        if (response.ok) {
          const post = await response.json()
          setOriginalPost(post)
          setTitle(post.title)
          setContent(post.content)
          setTags(post.tags.map((tag: { name: string }) => tag.name))
        } else {
          alert("Failed to load post for editing")
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching post for edit:", error)
        alert("Failed to load post for editing")
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    if (editId && session) {
      setIsEditing(true)
      fetchPostForEdit(editId)
    }
  }, [editId, session, router])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSave = async () => {
    if (!session) {
      router.push("/signin")
      return
    }

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    setIsLoading(true)
    try {
      const url = isEditing ? `/api/posts/${editId}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          published: isEditing ? originalPost?.published : false, // Keep original publish status or save as draft
        }),
      })

      if (response.ok) {
        const post = await response.json()
        alert(isEditing ? "Post updated successfully!" : "Post saved as draft!")
        router.push(`/posts/${post.id}`)
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${isEditing ? 'update' : 'save'} post`)
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'saving'} post:`, error)
      alert(`Failed to ${isEditing ? 'update' : 'save'} post`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!session) {
      router.push("/signin")
      return
    }

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    setIsLoading(true)
    try {
      const url = isEditing ? `/api/posts/${editId}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          published: true, // Publish immediately
        }),
      })

      if (response.ok) {
        const post = await response.json()
        alert(isEditing ? "Post updated and published!" : "Post published successfully!")
        router.push(`/posts/${post.id}`)
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${isEditing ? 'update and publish' : 'publish'} post`)
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating and publishing' : 'publishing'} post:`, error)
      alert(`Failed to ${isEditing ? 'update and publish' : 'publish'} post`)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // Will redirect
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
        <nav className="ml-auto hidden lg:flex gap-4 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/posts">
            All Posts
          </Link>
          {session ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : isEditing ? "Update" : "Save Draft"}
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Publishing..." : isEditing ? "Update & Publish" : "Publish"}
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/signin">Sign In to Write</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto lg:hidden flex items-center gap-1 sm:gap-2">
          {session ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="px-2 sm:px-3 bg-transparent"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">{isEditing ? "Update" : "Save"}</span>
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                className="px-2 sm:px-3"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">{isEditing ? "Update & Publish" : "Publish"}</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4 py-4 sm:py-8">
          {
            // Editor Mode
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  {isEditing ? "Edit Your Story" : "Write Your Story"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm sm:text-base">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base sm:text-lg font-medium"
                  />
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm sm:text-base">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 text-sm sm:text-base"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      className="px-2 sm:px-3 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Markdown Editor */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm sm:text-base">
                    Content
                  </Label>
                  <MarkdownEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your story in Markdown..."
                  />
                </div>

                {/* Writing Tips */}
                <div className="bg-blue-50 dark:bg-blue-950 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Writing Tips:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Use Markdown formatting to make your content more engaging</li>
                    <li>• Add images to illustrate your points and break up text</li>
                    <li>• Use headings (## Heading) to structure your content</li>
                    <li>• Preview your post using the Preview tab before publishing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </main>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <WritePageContent />
    </Suspense>
  )
}
