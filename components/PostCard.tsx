import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Heart, MessageCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ShareMenu } from "@/components/ShareMenu"
import { getCardImage, cleanExcerpt } from "@/lib/blog-utils"
import { useLike } from "@/lib/hooks/usePostInteractions"
import { useSession } from "next-auth/react"

interface Post {
    id: string
    title: string
    content?: string
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

interface PostCardProps {
    post: Post
    getAuthorInitials: (name: string) => string
    calculateReadTime: (excerpt: string) => string
    getTagName: (tag: string | { name: string }) => string
}

export function PostCard({ post, getAuthorInitials, calculateReadTime, getTagName }: PostCardProps) {
    const { data: session } = useSession()
    const { liked, likeCount, loading, toggleLike } = useLike(
        post.id,
        false,
        post._count?.likes || post.likes || 0
    )

    const handleCommentClick = () => {
        if (!session?.user) {
            window.location.href = '/signin'
            return
        }
        // Navigate to post with comments section
        window.location.href = `/posts/${post.id}#comments`
    }

    return (
        <Card className="flex flex-col h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-900">
            {/* Clickable Image Section with Enhanced Hover */}
            <Link href={`/posts/${post.id}`} className="block relative h-44 sm:h-48 overflow-hidden group/image">
                <Image
                    src={getCardImage(post.content || '', post.title, post.tags.map(tag => typeof tag === 'string' ? tag : tag.name))}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover blog-card-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent blog-card-overlay opacity-0 group-hover:opacity-100" />

                {/* Hover overlay with read icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/95 dark:bg-black/95 rounded-full p-4 blog-card-icon transform scale-0 group-hover:scale-100 shadow-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                </div>

                {/* Read Post Badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Read Post
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <CardHeader className="pb-4 px-5 pt-5">
                {/* Author Info */}
                <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src={post.author.avatar || post.author.image || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback className="text-xs">
                            {post.author.initials || getAuthorInitials(post.author.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">{post.author.name}</span>
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                                {post.readTime || calculateReadTime(post.excerpt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Title - Better Sizing */}
                <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer text-lg sm:text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors min-h-[3rem] sm:min-h-[3.5rem]">
                    <Link href={`/posts/${post.id}`} className="block">
                        {post.title}
                    </Link>
                </CardTitle>

                {/* Excerpt - Better Spacing */}
                <CardDescription className="line-clamp-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cleanExcerpt(post.excerpt, 140)}
                </CardDescription>
            </CardHeader>

            {/* Footer Section */}
            <CardContent className="flex-1 flex flex-col justify-between pt-0 px-5 pb-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2.5 py-1">
                            {getTagName(tag)}
                        </Badge>
                    ))}
                    {post.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs px-2.5 py-1">
                            +{post.tags.length - 2}
                        </Badge>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="truncate">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <div className="flex items-center space-x-4 flex-shrink-0 ml-2">
                        <button
                            onClick={toggleLike}
                            disabled={loading}
                            className={`flex items-center space-x-1.5 transition-colors cursor-pointer ${liked
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'hover:text-red-500'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                            <span>{likeCount}</span>
                        </button>
                        <button
                            onClick={handleCommentClick}
                            className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors cursor-pointer"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments || post._count?.comments || 0}</span>
                        </button>
                        <ShareMenu postId={post.id} className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
