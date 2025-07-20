import { prisma } from "@/lib/prisma"
import { sanityClient } from "@/lib/sanity"

export class PostService {
  // Sync Sanity post to Prisma
  static async syncSanityPost(sanityPost: any, authorId: string) {
    return await prisma.post.upsert({
      where: { sanityId: sanityPost._id },
      update: {
        title: sanityPost.title,
        content: JSON.stringify(sanityPost.content),
        excerpt: sanityPost.excerpt,
        slug: sanityPost.slug.current,
        published: !!sanityPost.publishedAt,
      },
      create: {
        title: sanityPost.title,
        content: JSON.stringify(sanityPost.content),
        excerpt: sanityPost.excerpt || "",
        slug: sanityPost.slug.current,
        published: !!sanityPost.publishedAt,
        authorId,
        sanityId: sanityPost._id,
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
    const sanityPosts = await sanityClient.fetch(`
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
      const sanityContent = sanityPosts.find((sp: any) => sp._id === post.sanityId)
      return {
        ...post,
        sanityContent
      }
    })
  }
}