import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface LikeState {
    liked: boolean
    likeCount: number
    loading: boolean
}

export function useLike(postId: string, initialLiked = false, initialCount = 0) {
    const { data: session } = useSession()
    const [state, setState] = useState<LikeState>({
        liked: initialLiked,
        likeCount: initialCount,
        loading: false
    })

    // Fetch current like status when component mounts
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await fetch(`/api/posts/${postId}/like`)
                if (response.ok) {
                    const data = await response.json()
                    setState(prev => ({
                        ...prev,
                        liked: data.liked,
                        likeCount: data.likeCount
                    }))
                }
            } catch (error) {
                console.error('Error fetching like status:', error)
            }
        }

        if (session?.user) {
            fetchLikeStatus()
        }
    }, [postId, session?.user])

    const toggleLike = async () => {
        if (!session?.user) {
            // Redirect to login or show login modal
            window.location.href = '/signin'
            return
        }

        if (state.loading) return

        setState(prev => ({ ...prev, loading: true }))

        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setState(prev => ({
                    ...prev,
                    liked: data.liked,
                    likeCount: data.likeCount,
                    loading: false
                }))
            } else {
                throw new Error('Failed to toggle like')
            }
        } catch (error) {
            console.error('Failed to toggle like:', error)
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    return {
        ...state,
        toggleLike
    }
}

export function useShare() {
    const generateShareLink = async (postId: string, type: 'link' | 'twitter' | 'facebook' | 'linkedin' | 'email' = 'link') => {
        try {
            const response = await fetch(`/api/posts/${postId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type })
            })

            if (response.ok) {
                const data = await response.json()
                return data.shareUrl
            }
            throw new Error('Failed to generate share link')
        } catch (error) {
            console.error('Failed to generate share link:', error)
            return null
        }
    }

    const sharePost = async (postId: string, type: 'link' | 'twitter' | 'facebook' | 'linkedin' | 'email' = 'link') => {
        const shareUrl = await generateShareLink(postId, type)

        if (shareUrl) {
            if (type === 'link') {
                // Copy to clipboard
                try {
                    await navigator.clipboard.writeText(shareUrl)
                    // Simple success feedback
                    const toast = document.createElement('div')
                    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
          `
                    toast.textContent = '✓ Link copied to clipboard!'
                    document.body.appendChild(toast)
                    setTimeout(() => {
                        document.body.removeChild(toast)
                    }, 3000)
                } catch {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea')
                    textArea.value = shareUrl
                    document.body.appendChild(textArea)
                    textArea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textArea)
                    alert('Link copied to clipboard!')
                }
            } else if (type === 'email') {
                window.location.href = shareUrl
            } else {
                // Open in new window for social media
                window.open(shareUrl, '_blank', 'width=600,height=400')
            }
        }
    }

    return { sharePost, generateShareLink }
}
