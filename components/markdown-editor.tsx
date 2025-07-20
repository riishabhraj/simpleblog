"use client"

import React from "react"
import { useState, useCallback, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useDropzone } from "react-dropzone"
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { uploadImage } from "@/lib/supabase"

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({
  value = "",
  onChange,
  placeholder = "Type your markdown here...",
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(value)
  const [isUploading, setIsUploading] = useState(false)
  const { data: session } = useSession()

  // Sync with external value changes
  useEffect(() => {
    setMarkdown(value)
  }, [value])

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setMarkdown(newVal)
    onChange?.(newVal)
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        // Check if it's an image file
        if (!file.type.startsWith('image/')) {
          console.warn('Only image files are supported')
          continue
        }

        try {
          setIsUploading(true)

          // Upload to Supabase Storage
          const publicUrl = await uploadImage(file, session?.user?.id)

          // Create markdown with public URL
          const imageMarkdown = `![${file.name}](${publicUrl})`

          console.log('Image uploaded successfully:', publicUrl)

          setMarkdown((prev) => {
            const updated = prev ? `${prev}\n\n${imageMarkdown}` : imageMarkdown
            onChange?.(updated)
            return updated
          })
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }
    },
    [onChange, session?.user?.id],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
    },
    multiple: true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Editor</CardTitle>
        <CardDescription>Write and preview your markdown content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Textarea
              value={markdown}
              onChange={handleMarkdownChange}
              placeholder={placeholder}
              className="min-h-[300px]"
            />
            <div
              {...getRootProps()}
              className={`mt-4 border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${isDragActive
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-400 hover:border-gray-500'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={isUploading} />
              {isUploading ? (
                <p className="text-blue-600">Uploading image...</p>
              ) : isDragActive ? (
                <p className="text-blue-600">Drop the image here...</p>
              ) : (
                <p>Drag & drop an image, or click to select</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="prose dark:prose-invert max-w-none min-h-[300px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => (
                    <Image
                      src={src as string || ''}
                      alt={alt || 'Image'}
                      width={500}
                      height={300}
                      className="max-w-full h-auto rounded-lg my-4 shadow-sm border"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
