export function extractFirstImageFromMarkdown(content: string): string | null {
    // Match markdown image syntax: ![alt text](image_url)
    const imageRegex = /!\[.*?\]\((.*?)\)/
    const match = content.match(imageRegex)
    return match ? match[1] : null
}

export function cleanExcerpt(content: string): string {
    // Remove markdown image syntax from excerpts
    return content
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove ![alt](url) patterns
        .replace(/https?:\/\/[^\s]+/g, '') // Remove any remaining URLs
        .replace(/\s+/g, ' ') // Clean up extra whitespace
        .trim()
}

export function generatePlaceholderImage(title: string, category?: string): string {
    // Use Unsplash Source API for category-based images
    const unsplashCategory = category?.toLowerCase() || 'writing'
    return `https://source.unsplash.com/800x600/?${unsplashCategory},blog`
}

export function getCardImage(content: string, title: string, tags?: string[]): string {
    // First, try to extract image from content
    const extractedImage = extractFirstImageFromMarkdown(content)
    if (extractedImage) {
        return extractedImage
    }

    // Fallback to category-based placeholder
    const category = tags?.[0] || 'writing'
    return generatePlaceholderImage(title, category)
}

export function getTagName(tag: string | { name: string }): string {
    return typeof tag === 'string' ? tag : tag.name
}
