import { useState, useCallback } from 'react'

export interface Toast {
    id: string
    title: string
    description?: string
    type: 'success' | 'error' | 'info' | 'warning'
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { ...toast, id }

        setToasts((prev) => [...prev, newToast])

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)

        return id
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const toast = useCallback((toast: Omit<Toast, 'id'>) => {
        return addToast(toast)
    }, [addToast])

    return {
        toasts,
        toast,
        removeToast
    }
}
