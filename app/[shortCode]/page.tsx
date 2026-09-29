import { supabase, supabaseAdmin } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  const { data: url, error } = await supabase
    .from('urls')
    .select('long_url, click_count')
    .eq('short_code', shortCode)
    .single()

  if (error || !url) {
    notFound()
  }

  // Get headers for click tracking
  const headersList = await headers()
  const referrer = headersList.get('referer') || null
  const userAgent = headersList.get('user-agent') || null
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

  // Record click in clicks table (use admin client for server-side writes)
  const { error: clickError } = await supabaseAdmin
    .from('clicks')
    .insert([
      {
        short_code: shortCode,
        referrer,
        user_agent: userAgent,
        ip
      }
    ])

  if (clickError) {
    console.error('Failed to record click:', clickError)
  }

  // Increment click count (use admin client for server-side writes)
  const { error: countError } = await supabaseAdmin
    .from('urls')
    .update({ click_count: (url.click_count || 0) + 1 })
    .eq('short_code', shortCode)

  if (countError) {
    console.error('Failed to increment click count:', countError)
  }

  // Must stay outside any try/catch: redirect() signals via a thrown
  // NEXT_REDIRECT error, which a catch block would swallow.
  redirect(url.long_url)
}
