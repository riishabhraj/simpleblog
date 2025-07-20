// "use client"

// import ReactMarkdown from "react-markdown"
// import remarkGfm from "remark-gfm"

// interface MarkdownRendererProps {
//   content: string
//   className?: string
// }

// export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
//   return (
//     <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm]}
//         components={{
//           h1: ({ children }) => (
//             <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100">{children}</h1>
//           ),
//           h2: ({ children }) => (
//             <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>
//           ),
//           h3: ({ children }) => (
//             <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>
//           ),
//           p: ({ children }) => (
//             <p className="mb-4 text-gray-700 dark:text-gray-300">{children}</p>
//           ),
//           strong: ({ children }) => (
//             <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>
//           ),
//           em: ({ children }) => (
//             <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
//           ),
//           code: ({ children, className }) => {
//             const isInline = !className
//             if (isInline) {
//               return (
//                 <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
//                   {children}
//                 </code>
//               )
//             }
//             return (
//               <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200">
//                 {children}
//               </code>
//             )
//           },
//           pre: ({ children }) => (
//             <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6 border">
//               {children}
//             </pre>
//           ),
//           img: ({ src, alt }) => (
//             <img
//               src={src}
//               alt={alt || ""}
//               className="max-w-full h-auto rounded-lg my-6 shadow-sm border"
//               loading="lazy"
//               style={{ maxHeight: '500px', objectFit: 'contain' }}
//             />
//           ),
//           a: ({ href, children }) => (
//             <a
//               href={href}
//               className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {children}
//             </a>
//           ),
//           blockquote: ({ children }) => (
//             <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300">
//               {children}
//             </blockquote>
//           ),
//           ul: ({ children }) => (
//             <ul className="list-disc list-outside space-y-2 my-6 pl-6 text-gray-700 dark:text-gray-300">
//               {children}
//             </ul>
//           ),
//           ol: ({ children }) => (
//             <ol className="list-decimal list-outside space-y-2 my-6 pl-6 text-gray-700 dark:text-gray-300">
//               {children}
//             </ol>
//           ),
//           li: ({ children }) => (
//             <li className="mb-2">{children}</li>
//           ),
//         }}
//       >
//         {content}
//       </ReactMarkdown>
//     </div>
//   )
// }

// components/markdown-renderer.tsx
"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom image renderer to handle base64 data URLs
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="rounded-lg shadow-sm max-w-full h-auto my-4"
              style={{ maxWidth: '100%', height: 'auto' }}
              loading="lazy"
            />
          ),
          // Custom code renderer - Fixed the inline detection
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const isCodeBlock = match && className

            if (isCodeBlock) {
              return (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }

            // Inline code
            return (
              <code
                className={`bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200 ${className || ''}`}
                {...props}
              >
                {children}
              </code>
            )
          },
          // Custom heading renderers
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>
          ),
          // Custom paragraph renderer
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
          ),
          // Custom text formatting
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
          ),
          // Custom link renderer
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Custom list renderers
          ul: ({ children }) => (
            <ul className="list-disc list-outside space-y-2 my-6 pl-6 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside space-y-2 my-6 pl-6 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-2">{children}</li>
          ),
          // Custom blockquote renderer
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          // Custom pre renderer for code blocks
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6 border">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}