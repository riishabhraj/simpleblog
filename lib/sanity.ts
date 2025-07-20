import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)


export function urlFor(source: any) {
  return builder.image(source)
}

// Sanity schemas (you'll need to set these up in your Sanity Studio)
export interface SanityPost {
  _id: string
  _type: 'post'
  title: string
  slug: { current: string }
  content: any[] // Portable Text
  excerpt?: string
  publishedAt: string
  author: {
    name: string
    image?: any
  }
  mainImage?: any
  tags?: string[]
}