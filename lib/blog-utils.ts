export function extractFirstImageFromMarkdown(content: string): string | null {
    // Match markdown image syntax: ![alt text](image_url)
    const imageRegex = /!\[.*?\]\((.*?)\)/
    const match = content.match(imageRegex)
    return match ? match[1] : null
}

export function cleanExcerpt(content: string, maxLength: number = 120): string {
    if (!content) return '';

    // Remove all markdown syntax and image references
    return content
        // Remove markdown image syntax
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        // Remove markdown links but keep the text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove markdown headers
        .replace(/#{1,6}\s+/g, '')
        // Remove markdown emphasis
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        // Remove blockquotes
        .replace(/>\s+/g, '')
        // Remove horizontal rules
        .replace(/---+/g, '')
        // Remove bullet points and numbers
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        // Clean up URLs and markdown artifacts
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/www\.[^\s]+/g, '')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up extra whitespace
        .replace(/\s+/g, ' ')
        .trim()
        // Truncate to maxLength and add ellipsis if needed
        .substring(0, maxLength)
        .replace(/\s+\S*$/, '') // Remove partial word at end
        .trim() + (content.length > maxLength ? '...' : '');
}

export function generatePlaceholderImage(title: string, category?: string): string {
    // Use Unsplash Source API for category-based images with a seed for consistency
    const unsplashCategory = category?.toLowerCase() || 'writing'
    const seed = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
    return `https://source.unsplash.com/800x600/?${unsplashCategory},blog&sig=${seed}`
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

export function calculateReadTime(content: string): string {
    if (!content) return '1 min read';

    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    return `${readTime} min read`;
}

export function getAuthorInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
