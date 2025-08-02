import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Mail, Copy } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useShare } from '@/lib/hooks/usePostInteractions'

interface ShareMenuProps {
    postId: string
    className?: string
}

export function ShareMenu({ postId, className }: ShareMenuProps) {
    const { sharePost } = useShare()
    const [isOpen, setIsOpen] = useState(false)

    const handleShare = async (type: 'link' | 'twitter' | 'facebook' | 'linkedin' | 'email') => {
        await sharePost(postId, type)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Share2 className={`cursor-pointer hover:text-primary transition-colors ${className}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleShare('link')} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                    <Facebook className="mr-2 h-4 w-4" />
                    Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('linkedin')} className="cursor-pointer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')} className="cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    Share via Email
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
