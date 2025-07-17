import { createBrowserClient, createServerClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function getServerSupabaseClient() {
  // Import next/headers only inside the function to avoid client-side import errors
  const { cookies } = require('next/headers')
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: cookieStore.get.bind(cookieStore),
        set: cookieStore.set.bind(cookieStore),
        remove: cookieStore.delete.bind(cookieStore),
      }
    }
  )
}



