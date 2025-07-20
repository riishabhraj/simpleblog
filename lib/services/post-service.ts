import { prisma } from "@/lib/prisma"
import { sanityClient } from "@/lib/sanity"

interface SanityPostInput {
  _id: string
  title: string
  content: Record<string, unknown>[]
  excerpt?: string
  slug: { current: string }
  publishedAt?: string
}

interface SanityPostData {
  _id: string
  title: string
  slug: { current: string }
  content: Record<string, unknown>[]
  mainImage?: unknown
  publishedAt?: string
}

export class PostService {
  // Create post from Sanity data
  static async createFromSanityPost(sanityPost: SanityPostInput, authorId: string) {
    return await prisma.post.create({
      data: {
        title: sanityPost.title,
        content: JSON.stringify(sanityPost.content),
        excerpt: sanityPost.excerpt || "",
        slug: sanityPost.slug.current,
        published: !!sanityPost.publishedAt,
        authorId,
      },
    })
  }

  // Get posts with Sanity content
  static async getPostsWithContent() {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch corresponding Sanity content
    const sanityPosts: SanityPostData[] = await sanityClient.fetch(`
      *[_type == "post"] {
        _id,
        title,
        slug,
        content,
        mainImage,
        publishedAt
      }
    `)

    return posts.map(post => {
      const sanityContent = sanityPosts.find((sp) => sp.slug.current === post.slug)
      return {
        ...post,
        sanityContent
      }
    })
  }
}