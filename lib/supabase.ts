// // lib/supabase.ts
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key exists:', !!supabaseAnonKey)

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(`Missing Supabase environment variables:
//     NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'exists' : 'missing'}
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'exists' : 'missing'}
//   `)
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // For server-side operations
// export const supabaseAdmin = createClient(
//   supabaseUrl,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false
//     }
//   }
// )

// // Helper function to upload image to Supabase Storage
// export async function uploadImage(file: File, userId?: string): Promise<string> {
//   try {
//     console.log('Starting upload for:', file.name, 'Size:', file.size)

//     const fileExt = file.name.split('.').pop()
//     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
//     const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`

//     console.log('Upload path:', filePath)

//     const { data, error } = await supabase.storage
//       .from('simpleblog')
//       .upload(filePath, file, {
//         cacheControl: '3600',
//         upsert: false
//       })

//     if (error) {
//       console.error('Upload error:', error)
//       throw error
//     }

//     console.log('Upload successful:', data)

//     // Get public URL
//     const { data: { publicUrl } } = supabase.storage
//       .from('simpleblog')
//       .getPublicUrl(filePath)

//     console.log('Generated public URL:', publicUrl)
//     return publicUrl
//   } catch (error: unknown) {
//     console.error('Error in uploadImage:', error)
//     if (error instanceof Error) {
//       throw new Error(`Failed to upload image: ${error.message}`)
//     }
//     throw new Error('Failed to upload image: Unknown error')
//   }
// }

// lib/supabase.ts
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key exists:', !!supabaseAnonKey)
// console.log('Supabase Key length:', supabaseAnonKey?.length)

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(`Missing Supabase environment variables:
//     NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'exists' : 'missing'}
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'exists' : 'missing'}
//   `)
// }

// // Add validation for the key format
// if (!supabaseAnonKey.startsWith('eyJ')) {
//   throw new Error('Invalid Supabase anon key format - should start with "eyJ"')
// }

// let supabase: any
// let supabaseAdmin: any

// try {
//   console.log('Creating Supabase client...')
//   supabase = createClient(supabaseUrl, supabaseAnonKey)
//   console.log('Supabase client created successfully')
// } catch (error) {
//   console.error('Error creating Supabase client:', error)
//   throw error
// }

// try {
//   console.log('Creating Supabase admin client...')
//   supabaseAdmin = createClient(
//     supabaseUrl,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     {
//       auth: {
//         autoRefreshToken: false,
//         persistSession: false
//       }
//     }
//   )
//   console.log('Supabase admin client created successfully')
// } catch (error) {
//   console.error('Error creating Supabase admin client:', error)
//   // Don't throw here, admin client is optional for client-side code
// }

// export { supabase, supabaseAdmin }

// // Helper function to upload image to Supabase Storage
// export async function uploadImage(file: File, userId?: string): Promise<string> {
//   try {
//     console.log('Starting upload for:', file.name, 'Size:', file.size)

//     const fileExt = file.name.split('.').pop()
//     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
//     const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`

//     console.log('Upload path:', filePath)

//     const { data, error } = await supabase.storage
//       .from('simpleblog')
//       .upload(filePath, file, {
//         cacheControl: '3600',
//         upsert: false
//       })

//     if (error) {
//       console.error('Upload error:', error)
//       throw error
//     }

//     console.log('Upload successful:', data)

//     // Get public URL
//     const { data: { publicUrl } } = supabase.storage
//       .from('simpleblog')
//       .getPublicUrl(filePath)

//     console.log('Generated public URL:', publicUrl)
//     return publicUrl
//   } catch (error: unknown) {
//     console.error('Error in uploadImage:', error)
//     if (error instanceof Error) {
//       throw new Error(`Failed to upload image: ${error.message}`)
//     }
//     throw new Error('Failed to upload image: Unknown error')
//   }
// }

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)
console.log('Supabase Key length:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables:
    NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'exists' : 'missing'}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'exists' : 'missing'}
  `)
}

// Add validation for the key format
if (!supabaseAnonKey.startsWith('eyJ')) {
  throw new Error('Invalid Supabase anon key format - should start with "eyJ"')
}

let supabase: SupabaseClient
let supabaseAdmin: SupabaseClient | null = null

try {
  console.log('Creating Supabase client...')
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('Supabase client created successfully')
} catch (error) {
  console.error('Error creating Supabase client:', error)
  throw error
}

// Only create admin client on server side
if (typeof window === 'undefined') {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      console.log('Creating Supabase admin client...')
      supabaseAdmin = createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      console.log('Supabase admin client created successfully')
    } else {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not found - admin client not available')
    }
  } catch (error) {
    console.error('Error creating Supabase admin client:', error)
  }
}

export { supabase, supabaseAdmin }

// Helper function to upload image to Supabase Storage
export async function uploadImage(file: File, userId?: string): Promise<string> {
  try {
    console.log('Starting upload for:', file.name, 'Size:', file.size)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`

    console.log('Upload path:', filePath)

    const { data, error } = await supabase.storage
      .from('simpleblog')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    console.log('Upload successful:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('simpleblog')
      .getPublicUrl(filePath)

    console.log('Generated public URL:', publicUrl)
    return publicUrl
  } catch (error: unknown) {
    console.error('Error in uploadImage:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
    throw new Error('Failed to upload image: Unknown error')
  }
}